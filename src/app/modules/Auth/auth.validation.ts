import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string()
  .nonempty("Password is required")   
  .min(8, "Password must be at least 8 characters"),
  }),
});




export const AuthValidation = {
  loginValidationSchema,

};