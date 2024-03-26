const getPageLogin = (req, res) => {
  return res.render("page-login", {
    errors: req.flash("errors"),
  });
};

export default {
  getPageLogin,
};
