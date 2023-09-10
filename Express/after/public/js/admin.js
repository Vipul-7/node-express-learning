const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const productElement = btn.closest("article"); // used to find the closest element

  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
  })
    .then((result) => result.json())
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => console.log(err));
};
