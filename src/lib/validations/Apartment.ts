import { z } from "zod";
// Define schema for Apartment object validation
export const ApartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  project: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .union([
      z.number().positive({ message: "Price must be greater than 0" }),
      z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Price must be a valid positive number",
        })
        .transform((val) => Number(val)),
    ])
    .transform((val) => Number(val)),
  contactNumber: z
    .string()
    .regex(/^(\+201|00201)[0-2,5]{1}[0-9]{8}$/, "Contact number should be in the format +201101029668"),
  imageUrls: z
    .array(z.string().regex(/^\/api\/files\/.*/, "Invalid image URL format"))
    .min(1, "At least one image is required")
    .max(8, "Maximum of 8 images allowed"),
});


export type ApartmentFormInput = z.input<typeof ApartmentSchema>; // before transform
