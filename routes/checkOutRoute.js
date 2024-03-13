import express from "express";

const checkOutRoute = express.Router();

checkOutRoute.get("/", (req, res) => {
  res.render("shop-checkout");
});

export default checkOutRoute;
