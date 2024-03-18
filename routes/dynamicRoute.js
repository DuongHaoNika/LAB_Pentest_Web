import express from "express";

const dynamicRoute = express.Router();

dynamicRoute.get("/:page", (req, res) => {
  const page = req.params.page;
  res.render(page, { password: "1234" });
});

export default dynamicRoute;
