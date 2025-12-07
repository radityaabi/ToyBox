import { z } from "zod";

const ToySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  slug: z.string().min(1).optional(),
  categories: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
  brand: z.string().min(2).optional(),
  price: z.number().min(100).optional(),
  age_range: z.string().min(1).optional(),
  image: z.url().optional(),
  description: z.string().min(3).optional(),
  created_at: z.date().optional(),
  updated_at: z.union([z.date(), z.null()]).optional(),
});

type Toy = z.infer<typeof ToySchema>;

export { ToySchema, Toy };
