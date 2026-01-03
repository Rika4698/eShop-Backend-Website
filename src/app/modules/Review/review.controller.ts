import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { IAuthUser } from "../Users/user.interface";
import { ReviewServices } from "./review.service";



const createReview = catchAsync(async (req, res) => {
    const result = await ReviewServices.createReview(
        req.body,
        req.user as IAuthUser
    );

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Review created successfully!",
        data: result,
    });
});




const createReply = catchAsync(async (req, res) => {
    const result = await ReviewServices.createReply(
        req.body,
        req.user as IAuthUser 
    );

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Reply sent successfully!",
        data: result,
    });
});


const getAllReviews = catchAsync(async (req, res) => {
    const query: Record<string, string> = Object.keys(req.query).reduce(
        (acc, key) => {
            const value = req.query[key];
            if (typeof value === "string") {
                acc[key] = value;
            }
            return acc;
        },
        {} as Record<string, string>
    );

    const result = await ReviewServices.getAllReviews(
        query,
        req.user as IAuthUser 
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reviews retrieved successfully!",
        data: result,
    });
});



const getCustomerReviews = catchAsync(async (req, res) => {
    const { customerId } = req.params;
    const query = req.query as Record<string, string>;
    const result = await ReviewServices.getCustomerReviews(customerId, query);
    
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Customer reviews retrieved successfully!",
        data: result.data,
        meta: result.meta,
    });
});


export const ReviewController = {
    createReview,
    getAllReviews,
    createReply,
    getCustomerReviews,
};