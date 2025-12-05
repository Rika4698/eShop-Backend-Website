import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.services';



const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategory(req.body,  req.files,    );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category created successfully!',
    data: result,
  });
});




export const CategoryController = {
  createCategory,
  
};
