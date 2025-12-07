import { z } from 'zod';

const createOrderValidationSchema = z.object({
  
    vendorId: z
      .string({
        error: 'Vendor Id is required',
      })
      .trim(),
  
    deliveryAddress: z
    .string({
      error: 'Delivery address is required',
    })
    .trim(),
    totalPrice: z
      .number({
        error: 'Total Price is required',
      })
      .nonnegative('Total Price must be a non-negative number'),
    coupon: z
      .string({
        error: 'Vendor Id is required',
      })
      .trim()
      .optional(),
    orderDetails: z.array(
      z.object({
        productId: z
          .string({
            error: 'Product Id is required',
          })
          .trim(),
        quantity: z
          .number({
            error: 'Product Quantity is required',
          })
          .int("Product Quantity must be an integer")
        .positive("Product Quantity must be positive"),
        pricePerUnit: z
          .number({
            error: 'Product Per unit is required',
          })
          .nonnegative('Product Price Per Unit must be a non-negative number'),
      }),
    ),

});

export const OrderValidations = {
  createOrderValidationSchema,
};
