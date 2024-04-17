import errorHandler from "../middlewares/errorHandler";
import indexRoute from "./indexRoute";
import productRoute from "./productRoute";
import settingRoute from "./settingRoute";

// Init all passport
// initPassportLocal();

const initWebRoutes = (app) => {
  app.use("/", indexRoute);
  app.use("/product", productRoute);
  app.use("/settings", settingRoute);
  app.use(errorHandler);
};

export default initWebRoutes;
