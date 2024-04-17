import express from "express";
import settingController from "../controllers/settingController";

const settingRoute = express.Router();

settingRoute.get("/", settingController.getIndex);
settingRoute.post("/", settingController.updateSetting);

export default settingRoute;
