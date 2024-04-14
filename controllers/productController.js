import productService from "../services/productService";

const getProduct = async (req, res) => {
  const query = req.query;
  if (query.id) {
    try {
      const product = await productService.getProductById(parseInt(query.id));
      query["product"] = product;
      // console.log(product);
      res.render("shop-product-right", req.query);
    } catch (err) {
      console.log(err);
      res.render("404");
    }
  } else {
    res.render("404");
  }
};

export default { getProduct };
