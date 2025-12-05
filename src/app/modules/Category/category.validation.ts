import z from "zod";


const createCategoryValidation = z.object({
  
    category: z.string({
      error: 'Category Name is required',
    }),
    label: z.string({
      error: 'Category Label is required',
    }),

});


export const categoryValidation = {
  createCategoryValidation,
  
};