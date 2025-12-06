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



const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const result = await ProductServices.getProductById(productId);

  if (result === null) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: 'No Data Found!',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product retrieved successfully!',
    data: result,
  });
});


const updateProduct = catchAsync(async (req, res)  => {
  const { productId } = req.params;

  const result = await ProductServices.updateProduct(productId, req.files,req.body, );
// console.log(result);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product updated successfully!',
    data: result,
  });
});


const duplicateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await ProductServices.duplicateProduct(productId);
// console.log(product,"product");

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Product duplicated successfully",
    data: product,
  });
});


const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const result = await ProductServices.deleteProduct(productId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product successfully deleted!',
    data: result,
  });
});



export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct,

};
