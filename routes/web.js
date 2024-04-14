import indexRoute from "./indexRoute";
import productRoute from "./productRoute";

// Init all passport
// initPassportLocal();

const initWebRoutes = (app) => {
  app.use("/", indexRoute);
  app.use("/product", productRoute);
};

export default initWebRoutes;
