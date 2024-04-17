import express from "express";
import indexController from "../controllers/indexController";

const indexRoute = express.Router();

indexRoute.get("/", indexController.getIndex);

export default indexRoute;
