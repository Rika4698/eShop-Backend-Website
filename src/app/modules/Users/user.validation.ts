
import { z } from 'zod';



const createUser = z.object({
  
    name: z.string({ error: "Name is required" }),
  email: z.string({ error: "Email is required" }).email("Invalid email address"),
  password: z.string({ error: "Password is required" }).min(8, "Password must be at least 8 characters"), 
  
});





export const userValidation = {
  createUser,
  
};