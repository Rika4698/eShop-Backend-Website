import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";



const createCategory = async (payload:
   { category: string; 
    image: string; 
    label?: string ,
    },
    files: any,) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      name: payload.category,
    },
  });

  if (isCategoryExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exists!');
  }
  const image = files?.image?.[0]?.path || "";
  if(image){
    payload.image = image
  }
  const result = await prisma.category.create({
    data: {
      name: payload.category,
      label: payload.label ? payload.label : payload.category,
      image: payload.image,
    },
  });

  return result;
};




export const CategoryServices = {
  createCategory,
 
};
