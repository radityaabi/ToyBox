import { Hono } from "hono";
import { Toys } from "./data";
import { Toy, ToySchema } from "./types/toy";
import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";

const slugify = require("slugify");

export const toyRoute = new Hono();

let dataToys = Toys;

// GET - Retrieve all toys
toyRoute.get("/", (c) => {
  return c.json(dataToys);
});

// GET - Retrieve search toys by name query
toyRoute.get("/search", (c) => {
  try {
    const query = c.req.query("q")?.toLowerCase() || "";
    if (!query) {
      return c.json({ message: "Query parameter 'q' is required" }, 400);
    }

    const searchResults = dataToys.filter((toy) =>
      toy.name.toLowerCase().includes(query)
    );

    if (searchResults.length === 0) {
      return c.json({ message: "No toys found matching the query" }, 404);
    }

    return c.json(searchResults);
  } catch (error) {
    return c.json({ message: "Error searching toys" }, 500);
  }
});

// GET - Retrieve toys by category ID
toyRoute.get("/category/:categoryId", (c) => {
  try {
    const categoryId = parseInt(c.req.param("categoryId"));
    const filteredToys = dataToys.filter(
      (toy) => toy.categories?.id === categoryId
    );

    if (filteredToys.length === 0) {
      return c.json(
        { message: "No toys found for the given category ID" },
        404
      );
    }

    return c.json(filteredToys);
  } catch (error) {
    return c.json({ message: "Error retrieving toys by category" }, 500);
  }
});

// DELETE - Delete a toy by ID
toyRoute.delete("/:id", (c) => {
  try {
    const id = c.req.param("id");
    const updatedDataToys = dataToys.filter((toy) => toy.id !== id);
    dataToys = updatedDataToys;
    return c.json({ message: "Toy deleted successfully" });
  } catch (error) {
    return c.json({ message: "Error deleting toy" }, 500);
  }
});

// POST - Create a new toy
toyRoute.post("/", zValidator("json", ToySchema), async (c) => {
  try {
    const toyJSON: Toy = await c.req.json();

    const newToy = {
      id: randomUUIDv7(),
      slug: String(slugify(toyJSON.name)),
      ...toyJSON,
      created_at: new Date(),
      updated_at: null,
    };

    const updatedDataToys = [...dataToys, newToy];
    dataToys = updatedDataToys;

    return c.json({ message: "Added new toy data", data: newToy }, 201);
  } catch (error) {
    return c.json({ message: "Error creating toy data" }, 500);
  }
});

// PATCH - Update a toy by ID
toyRoute.patch("/:id", zValidator("json", ToySchema), async (c) => {
  try {
    const id = c.req.param("id");
    const toyJSON: Toy = await c.req.json();
    const foundToyData = dataToys.find((toy) => toy.id === id);

    if (!foundToyData) {
      return c.json({ message: "Toy not found" }, 404);
    }

    const updatedToy = {
      ...foundToyData,
      ...toyJSON,
      updated_at: new Date(),
    };

    const updatedDataToys = dataToys.map((toy) =>
      toy.id === id ? updatedToy : toy
    );
    dataToys = updatedDataToys;

    return c.json({ message: "Toy data updated", data: updatedToy });
  } catch (error) {
    return c.json({ message: "Error updating toy data" }, 500);
  }
});

// PUT - Replace a toy by ID
toyRoute.put("/:id", zValidator("json", ToySchema), async (c) => {
  try {
    const id = c.req.param("id");
    const toyJSON: Toy = await c.req.json();
    const foundToyData = dataToys.find((toy) => toy.id === id);

    if (!foundToyData) {
      const newToy = {
        id: id,
        ...toyJSON,
        created_at: new Date(),
        updated_at: null,
      };

      const updatedDataToys = [...dataToys, newToy];
      dataToys = updatedDataToys;

      return c.json(
        { message: "Toy not found. Created new toy.", data: newToy },
        201
      );
    }

    const replacedToy = {
      id: id,
      ...toyJSON,
      created_at: foundToyData.created_at,
      updated_at: new Date(),
    };

    const updatedDataToys = dataToys.map((toy) =>
      toy.id === id ? replacedToy : toy
    );
    dataToys = updatedDataToys;

    return c.json({ message: "Toy data replaced", data: replacedToy });
  } catch (error) {
    return c.json({ message: "Error replacing toy data" }, 500);
  }
});

// GET - Retrieve a toy by slug
toyRoute.get("/:slug", (c) => {
  try {
    const slug = c.req.param("slug");
    const foundToy = dataToys.find((toy) => toy.slug === slug);

    if (foundToy) {
      return c.json(foundToy);
    } else {
      return c.json({ message: "Toy not found" }, 404);
    }
  } catch (error) {
    return c.json({ message: "Error retrieving toy by slug" }, 500);
  }
});
