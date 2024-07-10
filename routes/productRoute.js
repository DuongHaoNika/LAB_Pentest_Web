import express from "express";
import productController from "../controllers/productController";

const productRoute = express.Router();

productRoute.get("/search", productController.searchProduct)
productRoute.get("/", productController.getProduct)
productRoute.get("/add", productController.addProduct)
productRoute.get("/manage", productController.manageProduct)
productRoute.get("/:slug/edit", productController.editProduct)
productRoute.post("/add", productController.AddProduct)
productRoute.delete("/delete/:slug", productController.deleteProduct)

//BUG: https://github.com/mde/ejs/issues/720
// indexRoute.get("/", (req, res) => {
//   res.render("author", req.query);
// });

export default productRoute;
