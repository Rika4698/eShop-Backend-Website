import z from "zod";



const createCouponValidation = z.object({
  
    code: z.string({
      error: 'Coupon code is required',
    }),
    discountStatus: z.string({
      error: 'Coupon discount type is required',
    }),
    discountValue: z
      .number({
        error: 'Coupon discount value is required',
      })
      .nonnegative('Discount value must be a non-negative number'),
    endDate: z
      .string({
        error: 'Coupon end date is required',
      })
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
        'Invalid date format (YYYY-MM-DDTHH:mm:ss.sssZ)',
      )
      .refine(
        (str) => {
          const date = new Date(str);
          const now = new Date();
          return date >= now;
        },
        {
          message: 'Coupon end date cannot be in the past',
        },
      ),

});








export const couponValidation = {
  createCouponValidation,
  
};

