import { OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import {
  CategorySchema,
  CreateNewCategorySchema,
  CreateCategory,
  ErrorSchema,
  GetParamsSchema,
  ToySchema,
} from "../toy/schema-type";
import slugify from "slugify";

export const categoryRoute = new OpenAPIHono();

// GET - Retrieve a toy by slug
categoryRoute.openapi(
  {
    method: "get",
    path: "/{slug}",
    request: {
      params: GetParamsSchema,
    },
    description: "Retrieve a toy by its slug",
    responses: {
      200: {
        description: "Successfully retrieved the toy",
        content: { "application/json": { schema: z.array(ToySchema) } },
      },
      404: {
        description: "Toy not found",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        description: "Error retrieving toy by slug",
        content: { "application/json": { schema: ErrorSchema } },
      },
    },
  },
  async (c) => {
    try {
      const slug = c.req.param("slug");
      const result = await prisma.toy.findMany({
        where: {
          category: {
            slug: c.req.param("slug"),
          } as any,
        },
        include: {
          category: true,
        },
      });
      const foundCategory = result.filter((toy) => toy.category.slug === slug);

      if (foundCategory.length > 0) {
        return c.json(foundCategory, 200);
      } else {
        return c.json(
          {
            message: "Category not found",
            code: "GET_ERROR" as const,
          },
          404
        );
      }
    } catch (error) {
      return c.json(
        {
          message: "Error retrieving category by slug",
          code: "GET_ERROR" as const,
          error: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }
);

// POST - Create a new category
categoryRoute.openapi(
  {
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: CreateNewCategorySchema } },
      },
    },
    description: "Create a new category",
    responses: {
      201: {
        description: "Successfully created a new category",
        content: { "application/json": { schema: CategorySchema } },
      },
      400: {
        description: "Bad request",
        content: { "application/json": { schema: ErrorSchema } },
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Returns an error",
      },
    },
  },
  async (c) => {
    try {
      const payload: CreateCategory = c.req.valid("json");

      const categorySlug = payload.slug
        ? slugify(payload.slug, { strict: true, lower: true })
        : slugify(payload.name, { strict: true, lower: true });

      const checkExistingCategory = await prisma.category.findFirst({
        where: {
          slug: categorySlug,
        },
      });

      if (checkExistingCategory) {
        return c.json(
          {
            message: "Category already exists",
            code: "CATEGORY_EXISTS" as const,
          },
          400
        );
      }

      const newCategory = await prisma.category.create({
        data: {
          name: payload.name,
          slug: categorySlug,
        },
      });

      return c.json(newCategory, 201);
    } catch (error) {
      console.error("Error creating category:", error);
      return c.json(
        {
          message: "Error creating category",
          code: "CATEGORY_ADD_ERROR" as const,
          error: error instanceof Error ? error.message : String(error),
        },
        500
      );
    }
  }
);
