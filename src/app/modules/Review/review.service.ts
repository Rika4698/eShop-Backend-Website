import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { IAuthUser } from "../Users/user.interface";
import { TReview } from "./review.interface";

const createReview = async (payload: TReview, user: IAuthUser) => {
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

    // Validate product
    const product = await prisma.product.findUnique({
        where: {
            id: payload.productId,
        },
    });

    if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
    }

    // Validate vendor (optional but recommended)
    if (payload.vendorId) {
        const vendor = await prisma.vendor.findUnique({
            where: {
                id: payload.vendorId,
            },
        });

        if (!vendor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Vendor doesn't exist!");
        }
    }

    //  customer already reviewed this product
    const existingReview = await prisma.review.findFirst({
        where: {
            customerId: customer.id,
            productId: payload.productId,
        },
    });

    // If review exists, update it instead of creating new
    if (existingReview) {
        const updatedReview = await prisma.review.update({
            where: {
                id: existingReview.id,
            },
            data: {
                rating: payload.rating,
                comment: payload.comment,
                updatedAt: new Date(),
            },
            include: {
                product: true,
                customer: true,
                vendor: true,
            },
        });

        return updatedReview;
    }

    // Create new review if doesn't exist
    const reviewInfo = { 
        ...payload, 
        customerId: customer.id,
        vendorId: payload.vendorId || product.vendorId, 
    };

    const result = await prisma.review.create({
        data: reviewInfo,
        include: {
            product: true,
            customer: true,
            vendor: true,
        },
    });

    return result;
};



const createReply = async (payload: any, user: IAuthUser) => {
    // Validate review exists
    const review = await prisma.review.findUnique({
        where: {
            id: payload.reviewId,
        },
        include: {
            product: true,
        },
    });

    if (!review) {
        throw new AppError(StatusCodes.NOT_FOUND, "Review doesn't exist!");
    }

   
    const vendor = await prisma.vendor.findUnique({
        where: {
            email: user?.email,
            isDeleted: false,
        },
    });

    if (!vendor) {
        throw new AppError(StatusCodes.FORBIDDEN, "Only vendors can reply to reviews!");
    }

   
    if (review.product.vendorId !== vendor.id) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            "You can only reply to reviews of your own products!"
        );
    }

    // Validate user exists 
    const userAccount = await prisma.user.findUnique({
        where: {
            email: user?.email,
        },
    });

    if (!userAccount) {
        throw new AppError(StatusCodes.NOT_FOUND, "User account doesn't exist!");
    }

    const result = await prisma.reviewReply.create({
        data: {
            reviewId: payload.reviewId,
            userId: userAccount.id,
            comment: payload.comment,
        },
        include: {
            review: {
                include: {
                    product: true,
                    customer: true,
                },
            },
            user: true,
        },
    });

    return result;
};




const getAllReviews = async (query: Record<string, string>, user?: IAuthUser) => {
   
    if (query.vendorId && user) {
        const vendor = await prisma.vendor.findUnique({
            where: {
                email: user?.email,
                isDeleted: false,
            },
        });

       
        if (vendor && query.vendorId !== vendor.id) {
            throw new AppError(
                StatusCodes.FORBIDDEN,
                "You can only view reviews for your own products!"
            );
        }
    }

    if (!query.productId && !query.vendorId) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Either productId or vendorId must be provided!"
        );
    }

    if (query.productId) {
        const product = await prisma.product.findUnique({
            where: {
                id: query.productId,
            },
        });

        if (!product) {
            throw new AppError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
        }

        return prisma.review.findMany({
            where: {
                productId: query.productId,
            },
            include: {
                product: true,
                customer: true,
                vendor: true,
                ReviewReply: {
                    where: {
                        isDeleted: false,
                    },
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    if (query.vendorId) {
        const vendor = await prisma.vendor.findUnique({
            where: {
                id: query.vendorId,
            },
        });

        if (!vendor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Vendor doesn't exist!");
        }

        return prisma.review.findMany({
            where: {
                vendorId: query.vendorId,
            },
            include: {
                product: true,
                customer: true,
                vendor: true,
                ReviewReply: {
                    where: {
                        isDeleted: false,
                    },
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};




const getCustomerReviews = async (customerId: string) => {
    const customer = await prisma.customer.findUnique({
        where: {
            id: customerId,
        },
    });

    if (!customer) {
        throw new AppError(StatusCodes.NOT_FOUND, "Customer doesn't exist!");
    }

    return prisma.review.findMany({
        where: {
            customerId: customerId,
        },
        include: {
            product: true,
            vendor: true,
            ReviewReply: {
                where: {
                    isDeleted: false,
                },
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};


const deleteReview = async (reviewId: string, userId: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new AppError(StatusCodes.NOT_FOUND, "Review doesn't exist!");
    }

   
    const customer = await prisma.customer.findFirst({
        where: {
            id: review.customerId,
            email: userId, 
        },
    });

    if (!customer) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to delete this review!"
        );
    }

    const result = await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });

    return result;
};

export const ReviewServices = {
    createReview,
    getAllReviews,
    createReply,
    getCustomerReviews,
    deleteReview,
};