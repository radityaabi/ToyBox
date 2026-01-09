import { z } from "@hono/zod-openapi";

export const SlugSchema = z.string().min(3);

export const SearchQuerySchema = z.object({
  q: z.string().min(1),
});

export const CategorySchema = z.object({
  id: z.number().openapi({ example: 1 }).optional(),
  name: z.string().min(3).openapi({ example: "Action Figure" }),
  slug: SlugSchema.openapi({ example: "action-figure" }).optional(),
});

export const CreateCategorySchema = CategorySchema.pick({
  name: true,
  slug: true,
});

export const ToyResponseSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  sku: z.string().min(3).openapi({ example: "TOY-001" }),
  name: z.string().min(3).openapi({ example: "Action Figure" }),
  slug: SlugSchema.openapi({ example: "action-figure" }).optional(),
  category: CategorySchema.optional(),
  brand: z
    .string()
    .min(2)
    .openapi({ example: "ToyBrand" })
    .optional()
    .nullable(),
  price: z.number().min(100).openapi({ example: 19000 }).optional(),
  ageRange: z
    .string()
    .min(1)
    .openapi({ example: "3-5 years" })
    .optional()
    .nullable(),
  imageUrl: z
    .url()
    .openapi({ example: "https://example.com/image.jpg" })
    .optional()
    .nullable(),
  description: z
    .string()
    .min(3)
    .openapi({ example: "A fun action figure for kids." })
    .optional()
    .nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional().nullable(),
});

export const ToyInputSchema = ToyResponseSchema.omit({ category: true }).extend(
  {
    categoryId: z.number(),
  }
);

export const SearchResultSchema = z.array(ToyResponseSchema);

export const CreateToySchema = ToyInputSchema.pick({
  sku: true,
  name: true,
  slug: true,
  categoryId: true,
  brand: true,
  price: true,
  ageRange: true,
  imageUrl: true,
  description: true,
});

export const UpdateToySchema = ToyInputSchema.pick({
  sku: true,
  name: true,
  slug: true,
  categoryId: true,
  brand: true,
  price: true,
  ageRange: true,
  imageUrl: true,
  description: true,
}).partial();

export const ReplaceToySchema = ToyInputSchema.pick({
  sku: true,
  name: true,
  slug: true,
  categoryId: true,
  brand: true,
  price: true,
  ageRange: true,
  imageUrl: true,
  description: true,
});

export const ParamIdSchema = z.object({
  id: z.coerce.number().positive(),
});

export const GetParamsSchema = z.object({
  slug: SlugSchema,
});

export const ErrorSchema = z.object({
  message: z.string().openapi({ example: "Not Found" }),
  code: z
    .enum([
      "GET_ERROR",
      "SEARCH_ERROR",
      "SEARCH_NOT_FOUND",
      "DELETE_ERROR",
      "ADD_ERROR",
      "UPDATE_ERROR",
      "TOY_NOT_FOUND",
      "REPLACE_ERROR",
      "CATEGORY_ADD_ERROR",
      "CATEGORY_EXISTS",
      "CATEGORY_NOT_FOUND",
      "CATEGORY_DELETE_ERROR",
      "INVALID_QUERY",
      "SLUG_EXISTS",
    ])
    .openapi({ example: "SEARCH_ERROR" }),
});

export type Toy = z.infer<typeof ToyResponseSchema>;
export type CreateToy = z.infer<typeof CreateToySchema>;
export type UpdateToy = z.infer<typeof UpdateToySchema>;
export type ReplaceToy = z.infer<typeof ReplaceToySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
