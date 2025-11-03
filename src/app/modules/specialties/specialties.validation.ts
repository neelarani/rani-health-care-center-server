import { z } from "zod";

export const create = z.object({
  title: z.string({
    error: "Title is required!",
  }),
});
