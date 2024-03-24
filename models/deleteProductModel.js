import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkProductByTitle = async (title) => {
    try {
        const product = await prisma.products.findUnique({
            where: {
                title: title
            }
        });
        return product;
    } catch (err) {
        throw err;
    }
};

const deleteProduct = async (title) => {
    try {
        const deletedProduct = await prisma.products.delete({
            where: {
                title: title
            }
        });
        return deletedProduct;
    } catch (err) {
        throw err;
    }
};

export default {
    deleteProduct,
    checkProductByTitle
};