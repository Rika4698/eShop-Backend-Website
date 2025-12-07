import { z } from 'zod';

const createReviewValidation = z.object({

    productId: z.string({
      error: 'Product Id is required',
    }),
    comment: z.string({
      error: 'Review comment is required',
    }),
    rating: z
      .number({
        error: 'Review rating is required',
      })
      .nonnegative('Rating must be a non-negative number')
      .max(5),

});

export const ReviewValidations = {
  createReviewValidation,
};