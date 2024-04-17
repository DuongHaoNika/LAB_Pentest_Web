import express from "express";
import useAppConfig from "./app/configs/app.conf.js";
import "dotenv/config";
import initWebRoutes from "./app/routes/web.js";
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

useAppConfig(app, __dirname);
initWebRoutes(app);

app.listen(port, () => {
  console.log(`Express started on port http://localhost:${port}`);
});
