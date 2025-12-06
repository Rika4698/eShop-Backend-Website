import z from "zod";


const createCategoryValidation = z.object({
  
    category: z.string({
      error: 'Category Name is required',
    }),
    label: z.string({
      error: 'Category Label is required',
    }),

});


const updateCategoryValidation = z.object({
  
    category: z
      .string({
        error: 'Category Name is required',
      })
      .optional(),
    label: z
      .string({
        error: 'Category Label is required',
      })
      .optional(),
 
});


export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation
  
};