import indexRoute from "./indexRoute";
import productRoute from "./productRoute";
import settingRoute from "./settingRoute";
import pageAccountRoute from "./pageAccountRoute"
import loginRoute from "./loginRoute";
import registerRoute from "./registerRoute"
import Authen from "../middlewares/authentication"
import adminRoute from "./adminRoute";
import notfoundPage from "../middlewares/404"
import pageAboutRoute from "./pageAboutRoute"
import wishlishRoute from "./wishlistRoute";
import vendorCardRoute from "./vendorCardRoute"
import subscribeMailRoute from "./subscribeMailRoute";
import shopCartRoute from "./shopcart";

const initWebRoutes = (app) => {
  app.use("/", indexRoute);
  app.use("/index", indexRoute);
  app.use("/settings", settingRoute);
  app.use(Authen)
  app.use("/product", productRoute);
  app.use("/page-account", pageAccountRoute)
  app.use("/page-login", loginRoute)
  app.use("/page-register", registerRoute)
  app.use("/admin", adminRoute)
  app.use("/page-about", pageAboutRoute)
  app.use("/shop-wishlist", wishlishRoute)
  app.use("/vendor-card", vendorCardRoute)
  app.use("/", subscribeMailRoute)
  app.use("/shop-grid-right", (req, res) => {res.render('shop-grid-right')})
  app.use("/shop-cart", shopCartRoute)
  app.use(notfoundPage)
  //app.use(errorHandler);
};

export default initWebRoutes;
