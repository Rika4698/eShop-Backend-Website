import { z } from 'zod';

const createProductValidation = z.object({

    name: z.string({
      error: 'Product Name is required',
    }),
    price: z
      .number({
        error: 'Product price is required',
      })
      .nonnegative('Price must be a non-negative number'),
    stockQuantity: z
      .number({
        error: 'Product quantity is required',
      })
      .int('Stock Quantity must be an integer')
      .nonnegative('Stock Quantity must be a non-negative integer'),
    description: z.string({
      error: 'Product description is required',
    }),
    categoryId: z.string({
      error: 'Category ID is required',
    }),
    flashSale: z.boolean().optional(),
    discount: z
      .number()
      .nonnegative('Discount must be a non-negative number')
      .optional(),

});


const updateProductValidation = z.object({
 
    name: z.string().optional(),
    price: z
      .number()
      .nonnegative('Price must be a non-negative number')
      .optional(),
    stockQuantity: z
      .number()
      .int('Stock Quantity must be an integer')
      .nonnegative('Stock Quantity must be a non-negative integer')
      .optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    flashSale: z.boolean().optional(),
    discount: z
      .number()
      .nonnegative('Discount must be a non-negative number')
      .optional(),

});


export const ProductValidation = {
  createProductValidation,
  updateProductValidation

};
