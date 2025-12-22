import { Hono } from "hono";
import { logger } from "hono/logger";
import { toyRoute } from "./modules/toy/route";
import { commonRoute } from "./modules/common/common";
import { categoryRoute } from "./modules/category/route";

const app = new Hono();

app.use(logger());

app.route("/", commonRoute);

app.route("/toys", toyRoute);
app.route("/categories", categoryRoute);

export default app;
