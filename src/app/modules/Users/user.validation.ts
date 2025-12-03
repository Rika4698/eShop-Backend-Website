
import { z } from 'zod';



const createUser = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    password: z.string()
  .nonempty("Password is required")   
  .min(8, "Password must be at least 8 characters"), 
  }),
});





export const userValidation = {
  createUser,
  
};