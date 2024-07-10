import libxmljs from "libxmljs"
import xml2js from "xml2js"
import prisma from "../models/prisma";

// [GET] shop-cart
const getShopCart = (req, res) => {
  return res.render("shop-cart");
};

// [POST] shop-cart
const addCart = async (req, res) => {
  try {
    let xmlDoc
    const xxeStatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "XXE"
      }
    })
    if(xxeStatus.status === "No") {
      const blacklists = ['<!ENTITY', '<!DOCTYPE', '%', '&', ';', 'SYSTEM']
      for(let i = 0; i < blacklists.length; i++) {
        if(req.body.includes(blacklists[i])) {
          console.log('Blacklist!')
          return res.json({ message: 'Error input!', redirectUrl: '/shop-cart' })
        }
      }

      const result = await xml2js.parseStringPromise(req.body, {explicitArray: false, trim: true, preserveWhitespace: true})
      const productId = result.product.productId;
      const quantity = result.product.quantity;

      const data = {
        message: "success",
        productId: productId,  
        quantity: quantity,                
        redirectUrl: '/shop-cart'      
      };
      return res.json(data);
    }
    else {
      xmlDoc = libxmljs.parseXml(req.body, { replaceEntities: true, preserveWhitespace: true })
      const productIdNode = xmlDoc.get('//productId')
      const quantityNode = xmlDoc.get('//quantity')
      const productId = productIdNode ? productIdNode.text() : undefined
      const quantity = quantityNode ? quantityNode.text() : undefined
      const data = {
        message: "success",
        productId: productId,  
        quantity: quantity,                
        redirectUrl: '/shop-cart'      
      };
      return res.json(data);
    }
  } catch (error) {
    console.error("Error parsing XML:", error)
    return res.json({ message: error, redirectUrl: '/shop-cart' })
  }
}

export default { getShopCart, addCart };
