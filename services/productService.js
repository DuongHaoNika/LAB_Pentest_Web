import prisma from "../models/prisma";
import { faker } from "@faker-js/faker";
import validateUrl from "../validations/urlValidation"
import axios from "axios";
const entities = require("entities")

async function getAllProducts() {
  try {
    const result = await prisma.product.findMany();
    return result;
  } catch (err) {
    console.log(err);
  }
}

// get a product
async function getProductById(slug) {
  try {
    const result = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function getProductByName(name) {
  try {
    const result = await prisma.product.findFirst({
      where: {
        title: name,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// add a product
async function addProduct(title, summary, picture, price, description) {
  try{
    const xssStatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "XSS"
      }
    })
    if(xssStatus.status == "No"){
      title = entities.encodeHTML(title)
      summary = entities.encodeHTML(summary)
      picture = entities.encodeHTML(picture)
      price = entities.encodeHTML(price)
      description = entities.encodeHTML(description)
    }
  }
  catch(err){
    console.log(err)
  }
  const slug = faker.helpers.slugify(title + "-" + faker.string.uuid())
  const categoryId = 1
  const vendorId = 5
  const discountType = faker.helpers.arrayElement(["percentage", "fixed"])
  const discountValue = faker.number.int({ min: 10, max: 50 })
  price = parseFloat(price)
  try {
    const cnt = await prisma.product.count()
    const result = await prisma.product.create({
      data: {
        id: cnt + 1,
        title: title,
        summary: summary,
        picture: picture,
        price: price,
        description: description,
        slug: slug,
        categoryId: categoryId,
        discountType: discountType,
        discountValue: discountValue,
        vendorId: vendorId
      }
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// update a product
async function updateProduct(id, data) {
  try {
    const result = await prisma.product.update({
      where: { id: id },
      data: data,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// delete a product
async function deleteProduct(slug) {
  try {
    await prisma.product.delete({
      where: { slug: slug },
    });
  } catch (err) {
    console.log(err);
  }
}

async function previewImage(url){
  try{
    const ssrfStatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "SSRF"
      }
    })
    if(ssrfStatus.status === "No"){
      if (!validateUrl.isExternalUrl(url)) {
        throw new Error('Invalid URL')
      }
      const ipAddress = await validateUrl.resolveHostname(url);
      if (!ipAddress) {
        throw new Error('Invalid URL')
      }
    }
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary').toString('base64');
    return imageBuffer
  }
  catch(err){
    console.log(err)
  }
}

export default { getAllProducts, getProductById, getProductByName, addProduct, updateProduct, deleteProduct, previewImage};
