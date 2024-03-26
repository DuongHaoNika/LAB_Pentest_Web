const getForgotPass = (req, res) => {
  return res.render("page-forgot-password", {
    errors: req.flash("errors"),
  });
};

export default getForgotPass;
