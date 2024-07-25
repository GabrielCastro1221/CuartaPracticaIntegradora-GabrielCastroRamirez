const socket = io();
const $ = document;

socket.on("products", (data) => {
  viewProducts(data);
});

const viewProducts = (productos) => {
  const prods = document.getElementById("product-list");
  prods.innerHTML = "";
  productos.docs.forEach((item) => {
    const cardProds = document.createElement("div");
    cardProds.innerHTML = ` 
        <div class="card p-2" style="width: 18rem;">
          <img src=${
            item.thumbnail
          } class="card-img-top" height="200" width="150" alt=${item.title}>
          <div class="card-body">
            <h5 class="card-title text-center text-uppercase fs-6 fw-bold">${
              item.title
            }</h5>
            <p class="card-title text-center"><span class="fw-semibold"> Categoria: </span> ${
              item.category
            }</p>
            <p class="card-title text-center"><span class="fw-semibold"> Stock: </span> ${
              item.stock
            }</p>
            <p class="card-title text-center"><span class="fw-semibold"> Precio: </span> $${
              item.price
            }</p>
            <div class="d-flex align-items-center mt-3 justify-content-around">
              <button type="button" class="btn-card-danger text-uppercase fw-bold delete-btn" onclick="deleteProduct('${String(
                item._id
              )}')">Eliminar</button>
                    <a href="/product/update/${item._id}" class="btn-card-ok text-decoration-none text-uppercase fw-bold">Editar</a>
            </div>
          </div>
        </div>
        `;
    prods.appendChild(cardProds);
    cardProds.querySelector("button").addEventListener("click", () => {
      deleteproduct(item._id);
    });
  });
};

const deleteproduct = (id) => {
  socket.emit("deleteProd", id);
};

document.getElementById("btnEnviar").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const producto = {
    title: $.getElementById("title").value,
    thumbnail: $.getElementById("img").value,
    description: $.getElementById("description").value,
    price: $.getElementById("price").value,
    img: $.getElementById("img").value,
    code: $.getElementById("code").value,
    stock: $.getElementById("stock").value,
    category: $.getElementById("category").value,
    status: $.getElementById("status").value === "true",
  };
  socket.emit("addProd", producto);
};
