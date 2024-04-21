import ProductModel from "../models/ProductModel";

const getPageAddProduct = (req, res) => {
    return res.render("product-add", {
        errors: req.flash("errors")
    });
};

const handleAddProduct = async (req, res) => {
    try {
        const { title, category, slug, description, price, picture, vendor, product_tag } = req.body;
        const newProduct = await ProductModel.addNewProduct({
            title,
            category,
            slug,
            description,
            price,
            picture,
            vendor,
            product_tag
        });

        if (newProduct) {
            return res.redirect("/index");
        } else {
            throw "Failed to add product";
        }
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/product-add");
    }
};

export default {
    getPageAddProduct,
    handleAddProduct
};