import config from '../../../config';
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});


const createVendor = catchAsync(async (req, res) => {
  const result = await userService.createVendor(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor created successfully!',
    data: result,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const result = await userService.createCustomer(req.body);
//   console.log(result,"customer");
 

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer created successfully!',
    data: result,
  });
});


export const userController = {

  createAdmin,
  createVendor,
  createCustomer,


};