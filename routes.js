const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("content-type", "text/html");
    res.write("<html>");
    res.write("<head><title>The Input Page</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="mess"/><button type="submit">Send</button></form></body>'
    );
    res.write("<html>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.text", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      }); // writeFileSync blocks the next code until file operations is not done
    });
  }

  res.setHeader("content-type", "text/html");
  res.write("<html>");
  res.write("<head><title>The new page</title></head>");
  res.write("<h1>The devils are coming, and I'm waiting for them <h1>");
  res.write("<html>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler