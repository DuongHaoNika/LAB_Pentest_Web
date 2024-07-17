import express from "express";
import useAppConfig from "./configs/app.conf.js";
import "dotenv/config";
import initWebRoutes from "./routes/web.js";
import flash from "connect-flash"
import contentSecurityPolicy from "helmet-csp"

require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(flash());

// app.use(contentSecurityPolicy({
//   directives: {
//     "default-src": ["'self'"],
//     "script-src": ["'self'"], 
//     "img-src": ["'self'", "https://loremflickr.com", "https://picsum.photos/"]
//   }
// }))

useAppConfig(app, __dirname);

initWebRoutes(app);

app.listen(port, () => {
  console.log(`Express started on port http://localhost:${port}`);
});
