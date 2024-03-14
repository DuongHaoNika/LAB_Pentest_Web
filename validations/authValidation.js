import { check } from "express-validator";

const validateRegister = [
  check("email", "Invalid email").isEmail().trim(),

  check(
    "password",
    "Invalid password. Password must be at least 2 chars long"
  ).isLength({ min: 2 }),

  check(
    "passwordConfirmation",
    "Password confirmation does not match password"
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),
];

const validateLogin = [
  check("email", "Invalid email").isEmail().trim(),

  check("password", "Invalid password").not().isEmpty(),
];

export default {
  validateRegister,
  validateLogin,
};
