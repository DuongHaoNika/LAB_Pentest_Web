const getPageRegister = (req, res) => {
  return res.render("page-register", {
    errors: req.flash("errors"),
  });
};

export default {
  getPageRegister,
};
