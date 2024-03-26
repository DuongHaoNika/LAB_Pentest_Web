const getAccount = (req, res) => {
    return res.render("page-account", {
        errors: req.flash("errors")
    });
};

export default getAccount;