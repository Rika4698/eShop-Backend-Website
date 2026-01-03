import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import { cloudinaryUpload } from "../../config/cloudinary.config";



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


const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};


/**
 * Extract the public_id from a Cloudinary URL
 * @param imageUrl The Cloudinary URL of the image
 */

const extractPublicId = (imageUrl: string): string | null => {
  try {
    const segments = imageUrl.split('/');
    const filenameWithExtension = segments[segments.length - 1];
    return filenameWithExtension.split('.')[0]; // Remove the file extension
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};


const updateCategory = async (
  categoryId: string,
  payload: { category?: string; label?:string },
  files: any
) => {
  // Check if the category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  // Handle the new image if uploaded
  const newImagePath = files?.image?.[0]?.path || null;

  if (newImagePath) {
    // If there is an existing image, delete it from Cloudinary
    if (existingCategory.image) {
      const publicId = extractPublicId(existingCategory.image);
      if (publicId) {
        await cloudinaryUpload.uploader.destroy(publicId); // Delete the old image
      }
    }
  }

 const updateData: any = {};

  if (payload.category) {
    updateData.name = payload.category;
  }

  if (payload.label) {
    updateData.label = payload.label;
  }

  if (newImagePath) {
    updateData.image = newImagePath;
  }

  // Update the category
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });

  return updatedCategory;
};



const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found!");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Remove categoryId from all products
      await tx.product.updateMany({
        where: { categoryId },
        data: { categoryId: null },
      });

      // Delete cloudinary image safely
      if (category.image) {
        try {
          const publicId = extractPublicId(category.image);
          if (publicId) {
            await cloudinaryUpload.uploader.destroy(publicId);
          }
        } catch (err) {
          console.warn("Cloudinary deletion failed:", err);
        }
      }

      // Delete the category
      const deletedCategory = await tx.category.delete({
        where: { id: categoryId },
      });

      return deletedCategory;
    });

    return {
      success: true,
      message: "Category deleted successfully!",
      data: result,
    };
  } catch (error) {
    console.error("Delete Category Error:", error);
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete category"
    );
  }
};



export const CategoryServices = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
 
};
