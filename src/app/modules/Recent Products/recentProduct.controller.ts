import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../Users/user.interface";
import { RecentProductViewServices } from "./recentProduct.service";




const createRecentProduct = catchAsync(async (req, res) => {
  const result = await RecentProductViewServices
  .createRecentProducts(
    req.body,
    req.user as IAuthUser,
  );
console.log(req.body,"body");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Added to Recent Products!',
    data: result,
  });
});



export const RecentProductViewController = {
  createRecentProduct,

};
