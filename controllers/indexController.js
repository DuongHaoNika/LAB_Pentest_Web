import productService from "../services/productService";

const getIndex = async (req, res) => {
  const products = await productService.getAllProducts();
  // console.log(products);
  res.render("pages/index/index", {
    products: products,
  });
};

export default { getIndex };
