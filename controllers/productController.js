import productService from "../services/productService";
import prisma from "../models/prisma";
const entities = require("entities")

// [GET] /product/:id
const getProduct = async (req, res) => {
  const query = req.query;
  if (query.id) {
    try {
      let product = await productService.getProductById(query.id);
      res.render("shop-product-right", {
        product,
      })
    } catch (err) {
      console.log(err);
      res.render("page-404");
    }
  } else {
    res.render("page-404");
  }
};

// [GET] /product/add
const addProduct = async (req, res) => {
  try{
    return res.render('add-product')
  }
  catch(err){
    console.log(err)
  }
}

// [POST] /product/add
const AddProduct = async (req, res) => {
  let { title, summary, picture, price, quantity, description } = req.body
  await productService.addProduct(title, summary, picture, price, description)
  return res.send("Add product successfully!")
} 

// [GET] /product/:slug/edit
const editProduct = async (req, res) => {
  const slug = req.params.slug
  try {

  }
  catch(err){
    console.log(err)
  }
  return res.render('edit-product')
}

// [DELETE] /product/delete/:slug
const deleteProduct = async (req, res) => {
  try {
    console.log(req.params.slug)
    await productService.deleteProduct(req.params.slug)
    return res.redirect('/product/manage')
  }
  catch (err){
    console.log(err)
  }
}

// [GET] /product/search
const searchProduct = async (req, res) => {
  const query = req.query
  let name = query.name
  let product

  const SQLIstatus = await prisma.vulnSetting.findUnique({
    where: {
      name: "SQLI"
    }
  })
  const xssStatus = await prisma.vulnSetting.findUnique({
    where: {
      name: "XSS"
    }
  })
  try{
    if(SQLIstatus.status === "No" || SQLIstatus.status === "Login" || xssStatus.status === "No"){
      const regex = /^[a-zA-Z0-9]+$/

      for (const key in query) {
        if (!regex.test(query[key])) {
            return res.status(400).send('Invalid characters in query parameters');
        }
      }
      product = await productService.getProductByName(name);
    }
    else if(SQLIstatus.status === "Blind SQLI"){
      product = await prisma.$queryRawUnsafe(`SELECT title, picture, summary, description from public."Product" where title = '${name}'`)
    }
    if(xssStatus.status === "Reflected XSS"){
      name = name.replaceAll("'", "\\\'")
      return res.send(`<p>Not found product: ${name}</p>`)
    }
    else{
      name = entities.encodeHTML(name)
      return res.send(`<p>Not found product: ${name}</p>`)
    }
  }
  catch(err){
    console.log(err)
    return res.send("No product found!")
  }
}

// [GET] /product/manage
const manageProduct = async (req, res) => {
  try{
    const products = await productService.getAllProducts()
    return res.render('manage-product', { products })
  }
  catch(err){
    console.log(err)
  }
}

// [GET] /product/add/previewImage
const previewImage = async (req, res) => {
  const imageUrl = req.query.url
  try {
      const imageBuffer = await productService.previewImage(imageUrl)
      res.send(`<img style="width: 300px; height: 300px" src="data:image/jpeg;base64,${imageBuffer}" />`);
  } catch (error) {
      console.log(error)
      res.status(400).send(error);
  }
}

export default { getProduct, searchProduct, addProduct, AddProduct, manageProduct, deleteProduct, editProduct, previewImage };