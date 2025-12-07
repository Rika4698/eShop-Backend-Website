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
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review created successfully!",
        data: result,
    });
});




const createReply = catchAsync(async (req, res) => {
    const result = await ReviewServices.createReply(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review Reply data Created!",
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

    const result = await ReviewServices.getAllReviews(query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reviews retrieved successfully!",
        data: result,
    });
});

export const ReviewController = {
    createReview,
    getAllReviews,
    createReply,
};
