import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { Request, Response } from 'express';
import { userFilterableFields } from "./user.constant";
import pick from "../../utils/pick";
import { IAuthUser } from "./user.interface";




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




const getAllFromDB = async (req: Request, res: Response) => {
 const filters = {
    searchTerm: req.query.searchTerm as string,
    role: req.query.role as string,
  };
  const options = {
    limit: Number(req.query.limit) || 10,
    page: Number(req.query.page) || 1,
  };

  const result = await userService.getAllFromDB(filters, options);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta,
  });
};




const changeUpdateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(req.body,"body");
  
  const result = await userService.updateUserStatus(id, req.body);


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users profile status changed!',
    data: result,
  });
});




const getMyProfile = catchAsync(async (req, res) => {
  const result = await userService.getMyProfile(req.user as IAuthUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My profile data fetched!',
    data: result,
  });
});




const getVendorUser = catchAsync(async (req, res) => {
  const { vendorId } = req.params;

  const result = await userService.getVendorUser(vendorId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor retrieved successfully!',
    data: result,
  });
});



const getCustomerUser = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await userService.getCustomerUser(email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer retrieved successfully!',
    data: result,
  });
});




const followVendor = catchAsync(async (req, res) => {
  const result = await userService.followVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer followed vendor shop successfully!',
    data: result,
  });
});




const unfollowVendor = catchAsync(async (req, res) => {
  const result = await userService.unfollowVendor(
    req.body,
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer unfollowed vendor shop successfully!',
    data: result,
  });
});




const updateVendor = catchAsync(async (req, res) => {
  const result = await userService.updateVendor(
    req.body,
    req.files, 
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Vendor profile updated successfully!',
    data: result,
  });
});



const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.updateAdmin(
    req.body,
    req.files,
    req.user as any
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin profile updated successfully!",
    data: result,
  });
});






const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  // req.body directly contains the fields (name, address, phone)
  // No need to parse JSON
   console.log('📝 Request Body:', req.body);
  console.log('📸 Request Files:', req.files);
  console.log('👤 Request User:', req.user);
  const result = await userService.updateCustomer(
    req.body,        // This now contains { name?, address?, phone? }
    req.files,       // Contains the uploaded files
    req.user as IAuthUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Customer profile updated successfully!',
    data: result,
  });
});






const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await userService.deleteUser(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User successfully deleted!",
    data: result,
  });
});



const updateVendorStatus = catchAsync(async (req, res) => {
  const { vendorId } = req.params; // Extract vendorId from URL
  const { isDeleted } = req.body; // Extract isDeleted from body
  
  // Call the service to update vendor status
  const result = await userService.updateVendorStatus(vendorId, isDeleted);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Vendor ${isDeleted ? 'added to' : 'removed from'} blacklist successfully!`,
    data: result,
  });
});



const getPublicVendors = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
    limit: Number(req.query.limit) || 12,
    page: Number(req.query.page) || 1,
   categoryId: req.query.categoryId && req.query.categoryId !== "null" ? req.query.categoryId as string : undefined,
  };
  // console.log("Filters:", filters);

  const result = await userService.getPublicVendors(filters);
 console.log(result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendors retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});



export const userController = {

  createAdmin,
  createVendor,
  createCustomer,
  changeUpdateUserStatus,
  getMyProfile,
  getVendorUser,
  getCustomerUser,
  followVendor,
  unfollowVendor,
  updateCustomer,
  updateVendor,
  getAllFromDB,
  deleteUser,
  updateVendorStatus,
  getPublicVendors,
  updateAdmin

};