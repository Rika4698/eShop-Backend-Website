import config from '../../../config';
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req.body);
//   const { refreshToken, accessToken, newUser } = result;

//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: true,
//   });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});




export const userController = {

  createAdmin,


};