import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../Users/user.interface";
import { OrderServices } from "./order.service";
import pick from "../../utils/pick";
import { orderFilterableFields } from "./order.interface";







const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrder(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    success: true,
    statusCode:StatusCodes.OK,
    message: 'Order Created Successfully',
    data: result,
  });
});



const getAllOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, orderFilterableFields);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await OrderServices.getAllOrders(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  
};