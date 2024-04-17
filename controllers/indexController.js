import productService from "../services/productService";

const getIndex = async (req, res) => {
  const products = await productService.getAllProducts();
  res.render("index", {
    products: products,
  });
};

export default { getIndex };
