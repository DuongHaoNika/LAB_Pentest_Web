import { checkProductByTitle, deleteProduct } from "../models/deleteProductModel";

const deleteProductController = async (req, res) => {
    try {
        const title = req.params.title;

        const product = await checkProductByTitle(title);
        if (!product) {
            throw err;
        }

        await deleteProduct(title);
        res.redirect("/index");
    } catch (err) {
        throw err;
    }
};

export default deleteProductController;