const http = require("http"); // core modules

const routes = require("./routes");

const server = http.createServer(routes);

// (req, res) => {
//   //   console.log(req.url);
//   //   process.exit();

// }

server.listen(3000);
