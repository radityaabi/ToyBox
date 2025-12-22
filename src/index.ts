import { Hono } from "hono";
import { logger } from "hono/logger";
import { toyRoute } from "./modules/toy/route";
import { commonRoute } from "./modules/common/common";

const app = new Hono();

app.use(logger());

app.route("/", commonRoute);

app.route("/toys", toyRoute);

app.route("/categories", categoryRoute);
// TODO
// /categories/:categorySlug
// GET - Retrieve toys by category ID

export default app;
