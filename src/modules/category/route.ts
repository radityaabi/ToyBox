import { Hono } from "hono";
import { dataToys } from "../toy/data";

export const categoryRoute = new Hono();

let toys = dataToys;

// GET - Retrieve a toy by slug
categoryRoute.get("/:slug", (c) => {
  try {
    const slug = c.req.param("slug");
    const foundCategory = toys.filter((toy) => toy.category?.slug === slug);

    if (foundCategory.length > 0) {
      return c.json(foundCategory);
    } else {
      return c.json({ message: "Category not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Error retrieving category by slug" }, 500);
  }
});
