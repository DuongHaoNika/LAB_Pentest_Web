import express from "express";
import productController from "../controllers/productController";

const productRoute = express.Router();

productRoute.get("/", productController.getProduct);

//BUG: https://github.com/mde/ejs/issues/720
// indexRoute.get("/", (req, res) => {
//   res.render("author", req.query);
// });

export default productRoute;
