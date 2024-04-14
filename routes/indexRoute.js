import express from "express";
import dynamicRoute from "./dynamicRoute";
import indexController from "../controllers/indexController";

const indexRoute = express.Router();

indexRoute.get("/", indexController.getIndex);

// indexRoute.get("/:page", dynamicRoute);

//BUG: https://github.com/mde/ejs/issues/720
// indexRoute.get("/", (req, res) => {
//   res.render("author", req.query);
// });

export default indexRoute;
