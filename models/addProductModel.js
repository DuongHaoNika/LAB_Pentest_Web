import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkProductByTitle = async (title) => {
    try {
        const product = await prisma.products.findUnique({
            where: {
                title: title,
            }
        });
        return product;
    } catch (err) {
        throw err;
    }
};

const addNewProduct = async (data) => {
    try {
        const isProductExist = await checkProductByTitle(data.title);
        if (isProductExist) {
            throw new Error(`This product has already existed on your shop`);
        } else {
            const newProduct = await prisma.products.create({
                data: {
                    title: data.title,
                    category: data.category,
                    slug: data.slug,
                    description: data.description,
                    price: data.price,
                    picture: data.picture,
                    vendor: data.vendor,
                    product_tag: data.product_tag
                }
            });
            return newProduct;
        }
    } catch (err) {
        throw err;
    }
};

export default {
    checkProductByTitle,
    addNewProduct
};