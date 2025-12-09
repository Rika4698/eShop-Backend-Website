
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../../config";



const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully!',
    token: accessToken,
    data: newUser,
  });
});




const createVendor = catchAsync(async (req, res) => {
  const result = await userService.createVendor(req.body);

  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor created successfully!',
    token: accessToken,
    data: newUser,
  });
});



const createCustomer = catchAsync(async (req, res) => {
  const result = await userService.createCustomer(req.body);
  console.log(result,"customer");
  const { refreshToken, accessToken, newUser } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer created successfully!',
    token: accessToken,
    data: newUser,
  });
});


export const userController = {

  createAdmin,
  createVendor,
  createCustomer,


};