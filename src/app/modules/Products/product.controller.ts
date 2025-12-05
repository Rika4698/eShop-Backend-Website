import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IAuthUser } from "../Users/user.interface";
import { ProductServices } from "./product.services";
import pick from "../../utils/pick";
import { productFilterableFields } from "./product.constant";



const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(
    req.body,
    req.user as IAuthUser,
    req.files,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});



const getAllProducts = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ProductServices.getAllProducts(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});




export const ProductController = {
  createProduct,
  getAllProducts,

};
