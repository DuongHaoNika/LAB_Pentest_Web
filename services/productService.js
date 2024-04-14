import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllProducts() {
  try {
    const result = await prisma.product.findMany();
    return result;
  } catch (err) {
    console.log(err);
  }
}

// get a product
async function getProductById(id) {
  try {
    const result = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// create a product
async function createProduct(data) {
  try {
    const result = await prisma.product.create({
      data: data,
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
async function deleteProduct(id) {
  try {
    const result = await prisma.product.delete({
      where: { id: id },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

export default { getAllProducts, getProductById };
