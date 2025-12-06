import { calculatePagination, IPaginationOptions } from "../../utils/calculatePagination";
import prisma from "../../utils/prisma";
import { IAuthUser } from "../Users/user.interface";
import { TProductFilterRequest, TProducts } from "./product.interface";
import { Prisma } from "@prisma/client";





const createProduct = async (
    payload: TProducts,
    user: IAuthUser,
    files: any
) => {
    const vendor = await prisma.vendor.findUniqueOrThrow({
        where: {
            email: user?.email,
            isDeleted: false,
        },
    });

    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId,
        },
    });
    const image = files?.image
        ? files?.image.map((file: { path: any }) => file.path)
        : [];

    const productInfo = {
        ...payload,
        vendorId: vendor.id,
        image: image,
    };

    const result = await prisma.product.create({
        data: productInfo,
        include: {
            category: true,
            vendor: true,
        },
    });

    return result;
};




const getAllProducts = async (
    filters: TProductFilterRequest,
    options: IPaginationOptions
) => {
    const { limit, page, skip } = calculatePagination(options);
    const {
        searchTerm,
        minPrice,
        maxPrice,
        vendorId,
        flashSale,
        category,
        ...filterData
    } = filters;

    const andConditions: Prisma.ProductWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }

    const minPriceNum = minPrice ? Number(minPrice) : undefined;
    const maxPriceNum = maxPrice ? Number(maxPrice) : undefined;

    // Filter by price range
    if (minPriceNum !== undefined && maxPriceNum !== undefined) {
        andConditions.push({
            price: {
                gte: minPriceNum,
                lte: maxPriceNum,
            },
        });
    }

    // Filter by Flash Sale
    const flashSaleBoolean =
        typeof flashSale === "string" ? flashSale === "true" : undefined;

    if (flashSaleBoolean !== undefined) {
        andConditions.push({
            flashSale: flashSaleBoolean,
        });
    }

    // Filter by vendorId
    if (vendorId) {
        andConditions.push({
            vendorId: {
                equals: vendorId,
            },
        });
    }

    if (category) {
        andConditions.push({
            category: {
                name: {
                    equals: category,
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        vendor: {
            isDeleted: false,
        },
    });

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.ProductWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { price: "asc" },
        include: {
            category: true,
            vendor: true,
            reviews: true,
        },
    });

    const total = await prisma.product.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};



const getProductById = async (productId: string) => {
    const product = await prisma.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false,
        },
        include: {
            category: true,
            vendor: true,
            reviews: {
                include: {
                    customer: true,
                },
            },
            orderDetails: true,
        },
    });

    return product;
};





const updateProduct = async (
    productId: string,
    files: any,
    updateData: Prisma.ProductUpdateInput
) => {
    // Ensure the product exists
    const existingProduct = await prisma.product.findUniqueOrThrow({
        where: { id: productId },
    });

    // Handle images if provided
    const image = files?.image
        ? files?.image.map((file: { path: any }) => file.path)
        : [];

    console.log(image);

    // If new images are provided, set the new image array to the updateData
    if (image.length > 0) {
        updateData.image = image;
    }

    // If the category hasn't changed, we should not update the category
    if (updateData.category === existingProduct.categoryId) {
        delete updateData.category;
    }

    // Proceed with updating the product
    const updatedProduct = await prisma.product.update({
        where: {
            id: productId,
        },
        data: updateData,
        include: {
            category: true,
            vendor: true,
            reviews: true,
        },
    });

    // console.log(updatedProduct, "Updated Product");

    return updatedProduct;
};


const duplicateProduct = async (productId: string) => {
    const originalProduct = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!originalProduct) {
        throw new Error("Product not found");
    }

    const newSlug = `${originalProduct.id}-2`;

    const { id, ...productData } = originalProduct;

    const result = await prisma.product.create({
        data: {
            ...productData,
            id: newSlug,
        },
    });
    console.log(result);
    return result;
};


const deleteProduct = async (productId: string) => {
    await prisma.product.findUniqueOrThrow({
        where: { id: productId },
    });

    const deletedProduct = await prisma.product.delete({
        where: {
            id: productId,
        },
        
    });

    return deletedProduct;
};

export const ProductServices = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    duplicateProduct,
    deleteProduct,
    
};
