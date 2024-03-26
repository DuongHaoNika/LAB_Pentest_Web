import registerService from "../Services/registerService";
import { validationResult } from "express-validator";

const getPageRegister = (req, res) => {
  return res.render("register", {
    errors: req.flash("errors"),
  });
};

const createNewUser = async (req, res) => {
  //validate required fields
  const errorsArr = [];
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });
    req.flash("errors", errorsArr);
    return res.redirect("/register");
  }

  //create a new user
  const newUser = {
    fullname: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    await registerService.createNewUser(newUser);
    return res.redirect("/login");
  } catch (err) {
    req.flash("errors", err);
    return res.redirect("/register");
  }
};
export default {
  getPageRegister,
  createNewUser,
};
