import { z } from "zod";

export const worksapceSchema = z.object({
    name: z.string().min(3).max(50)
});
