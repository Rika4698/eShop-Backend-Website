import { StatusCodes } from "http-status-codes";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import { IAuthUser } from "../Users/user.interface";
import { Request, Response } from "express";




const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
   sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000,
     path: "/",
});

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
     sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000,
     path: "/",
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
        user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});


const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  });
});



const changePassword = catchAsync(async (req:Request, res:Response) => {
  const user = req.user;

  const result = await AuthServices.changePassword(
    req.body,
    user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password Changed successfully',
    data: result,
  });
});



const forgotPassword = catchAsync(async (req:Request, res:Response) => {
  const userEmail = { email: req.body.email };
  // console.log('email:',userEmail);
  const result = await AuthServices.forgotPassword(userEmail);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});



const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await AuthServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  });
});



const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
 
};