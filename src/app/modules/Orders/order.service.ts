import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { IAuthUser } from "../Users/user.interface";
import { TOrder, TOrderFilterRequest } from "./order.interface";
import { Coupon, PaymentStatus, Prisma } from '@prisma/client';
import { initiatePayment } from "../../utils/payment";
import { calculatePagination, IPaginationOptions } from "../../utils/calculatePagination";
import crypto from 'crypto';




const generateTranId = () => {
  return 'TXN-' + crypto.randomBytes(8).toString('hex').toUpperCase();
}



const createOrder = async (payload: TOrder, user: IAuthUser) => {
 try {
    // console.log(' Starting order creation');
    // console.log('Payload:', JSON.stringify(payload, null, 2));
    // console.log('User:', user?.email);

    // Validate customer
    const customer = await prisma.customer.findUnique({
      where: {
        email: user?.email,
        isDeleted: false,
      },
    });

    if (!customer) {
      throw new AppError(StatusCodes.NOT_FOUND, "Customer doesn't exist!");
    }
    // console.log('Customer found:', customer.id);

    // Validate vendor
    const vendor = await prisma.vendor.findUnique({
      where: {
        id: payload.vendorId,
        isDeleted: false,
      },
    });

    if (!vendor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Vendor doesn't exist!");
    }
    // console.log(' Vendor found:', vendor.id);

    const tranId = generateTranId();
    // console.log(' Transaction ID generated:', tranId);

    let existingCoupon: null | Coupon = null;

    // Validate coupon if provided
    if (payload.coupon) {
      // console.log(' Validating coupon:', payload.coupon);
      
      existingCoupon = await prisma.coupon.findUnique({
        where: { code: payload.coupon },
      });

      if (!existingCoupon) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Coupon not found!');
      }

      if (!existingCoupon.isActive) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Coupon is inactive!');
      }

      if (new Date() > existingCoupon.endDate) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Coupon has expired!');
      }

      if (new Date() < existingCoupon.startDate) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Coupon is not yet active!');
      }

      // console.log('  Coupon validated:', existingCoupon.code);
    } else {
      console.log('ℹStep 5: No coupon provided');
    }

    // console.log(' Step 6: Starting transaction');


    // Check if customer already redeemed this coupon
  //   const alreadyRedeemed = await prisma.customerCoupon.findUnique({
  //     where: {
  //       customerId_couponId: {
  //         customerId: customer.id,
  //         couponId: existingCoupon.id,
  //       },
  //     },
  //   });

  //   if (alreadyRedeemed && alreadyRedeemed.isRedeemed) {
  //     throw new AppError(StatusCodes.BAD_REQUEST, 'You have already used this coupon!');
  //   }
  // }

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      
      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          vendorId: vendor.id,
          deliveryAddress: payload.deliveryAddress,
          transactionId: tranId,
          paymentStatus: PaymentStatus.PENDING,
          totalPrice: payload.totalPrice,
          couponCode: existingCoupon?.code || null,
        },
      });
      // console.log('Step 6: Order created:', order.id);

      // Consolidate products
      // console.log('Step: Consolidating products');
      // console.log('Original orderDetails:', JSON.stringify(payload.orderDetails, null, 2));
      
      const productMap = new Map<string, { 
        productId: string; 
        quantity: number; 
        pricePerUnit: number;
      }>();
      
      for (const detail of payload.orderDetails) {
        const existing = productMap.get(detail.productId);
        if (existing) {
          // console.log(`Consolidating product ${detail.productId}: ${existing.quantity} + ${detail.quantity}`);
          existing.quantity += detail.quantity;
        } else {
          productMap.set(detail.productId, {
            productId: detail.productId,
            quantity: detail.quantity,
            pricePerUnit: detail.pricePerUnit,
          });
        }
      }
      
      const consolidatedProducts = Array.from(productMap.values());
      // console.log('Products consolidated:', JSON.stringify(consolidatedProducts, null, 2));

      // Create order details and update stock
     
      for (const detail of consolidatedProducts) {
        // console.log(`Processing product ${detail.productId}`);
        
        const product = await tx.product.findUnique({
          where: { id: detail.productId },
        });

        if (!product) {
          throw new AppError(
            StatusCodes.NOT_FOUND,
            `Product with ID ${detail.productId} not found`,
          );
        }

        console.log(`Product ${product.name}: stock=${product.stockQuantity}, needed=${detail.quantity}`);

        if (product.stockQuantity < detail.quantity) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Required: ${detail.quantity}`,
          );
        }

        // Update product stock
        await tx.product.update({
          where: { id: detail.productId },
          data: {
            stockQuantity: {
              decrement: detail.quantity,
            },
          },
        });
        // console.log(`Stock updated for ${product.name}`);

        // Create order detail
        await tx.orderDetail.create({
          data: {
            orderId: order.id,
            productId: detail.productId,
            quantity: detail.quantity,
            pricePerUnit: detail.pricePerUnit,
          },
        });
        console.log(`OrderDetail created for ${product.name}`);
      }

      return order;
    });

  
    // Initiate payment
    
    const paymentData = {
      transactionId: tranId,
      amount: payload?.totalPrice,
      customerName: customer.name,
      customerEmail: customer.email,
    };

    const paymentSession = await initiatePayment(paymentData);
    

    return { paymentSession, order };

  } catch (error: any) {
    console.error('ERROR in createOrder:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};




const getAllOrders = async (
  filters: TOrderFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = calculatePagination(options);

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (Object.keys(filters).length > 0) {
    const filterConditions = Object.keys(filters).map((key) => ({
      [key]: {
        equals: (filters as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    vendor: {
      isDeleted: false,
    },
  });

  andConditions.push({
    customer: {
      isDeleted: false,
    },
  });

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { paymentStatus: 'asc' },
    include: {
      vendor: true,
      customer: true,
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const OrderServices = {
  createOrder,
  getAllOrders

};