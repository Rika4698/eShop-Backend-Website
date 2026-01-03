import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import prisma from "../../utils/prisma";
import bcrypt from 'bcryptjs';
import config from "../../config";
import { UserRole, UserStatus } from "@prisma/client";
import { createToken } from "../../utils/jwt";
import { IAuthUser } from "./user.interface";




export const createAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );


  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      include: { admin: true },
    });

    const admin = await tx.admin.create({
      data: {
        name: payload.name,
        email: user.email,
        image: "https://i.ibb.co/zTC2VwSK/4122823.png", 
      },
    });

    return { ...user, admin };
  });

  // Create JWT tokens
  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  // Return combined result
  const combinedResult = {
    accessToken,
    refreshToken,
    newUser,
  };

  return combinedResult;
};


export const createVendor = async (payload: {
  name: string;
  password: string;
  email: string;
  role?: string;
  shopName?: string;
  logo?: string;
  description?: string;
}) => {

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  console.log(existingUser);

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );


  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      },
      include: { vendor: true },
    });

    const vendor = await tx.vendor.create({
      data: {
        name: payload.name,
        email: user.email,
        shopName: payload.shopName,
        logo: payload.logo,
        description: payload.description,
      },
      include: { user: true },
    });

    return { ...user, vendor };
  });

  // Create JWT tokens
  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  // Return combined result
  const combinedResult = {
    accessToken,
    refreshToken,
    newUser,
  };

  return combinedResult;
};





export const createCustomer = async (payload: {
  name: string;
  password: string;
  email: string;
}) => {

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exists!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.BCRYPT_SALT_ROUND)
  );


  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
      include: { customer: true },
    });

    const customer = await tx.customer.create({
      data: {
        name: payload.name,
        email: user.email,
        image: "https://i.ibb.co/YBpxwzwN/free-user-icon-3297-thumb.png",
      },
      include: { user: true },
    });

    return { ...user, customer };
  });

  // Create JWT tokens
  const jwtPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES as string
  );

  // Return combined result
  const combinedResult = {
    accessToken,
    refreshToken,
    newUser,
  };

  return combinedResult;
};



const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findFirst({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!userInfo) {
  throw new AppError(StatusCodes.UNAUTHORIZED, "User not found or inactive");
}

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.VENDOR) {
    profileInfo = await prisma.vendor.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        products: true,
        orders: true,
        followers: {
          include: {
            customer: true,
          },
        },
      },
    });
  } else if (userInfo.role === UserRole.CUSTOMER) {
    profileInfo = await prisma.customer.findUnique({
      where: {
        email: userInfo.email,
      },
      include: {
        customerCoupons: true,
        orders: true,
        reviews: true,
        following: {
          include: {
            vendor: true,
          },
        },
        recentProductView: true,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};




const getVendorUser = async (id: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      products: true,
      followers: true,
      orders: true,
    },
  });

  return vendor;
};





const getCustomerUser = async (email: string) => {
  const vendor = await prisma.customer.findUniqueOrThrow({
    where: {
      email,
      isDeleted: false,
    },
    include: {
      following: true,
      orders: true,
      reviews: true,
      recentProductView: true,
    },
  });

  return vendor;
};



const followVendor = async (payload: { vendorId: string }, user: IAuthUser) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const follow = await prisma.follow.create({
    data: {
      customerId: customer.id,
      vendorId: vendor.id,
    },
    include: {
      customer: true,
      vendor: true,
    },
  });

  return follow;
};



const unfollowVendor = async (
  payload: { vendorId: string },
  user: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: user?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: payload.vendorId,
      isDeleted: false,
    },
  });

  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  const unfollow = await prisma.follow.delete({
    where: {
      customerId_vendorId: {
        customerId: customer.id,
        vendorId: vendor.id,
      },
    },
  });

  return unfollow;
};




const updateCustomer = async (
  payload: {
    name?: string;
    image?: string;
    address?: string;
    phone?: string;
  },files: any, 
  userData: IAuthUser,
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });

  if (!customer) {
      throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
    }

  // Use `any` to avoid TypeScript error
  const image = files?.image?.[0]?.path || "";

  if(image){
    payload.image = image
  }
  const result = await prisma.customer.update({
    where: {
      email: customer.email,
    },
    data: payload,
    include: {
      following: true,
      orders: true,
      reviews: true,
      recentProductView: true,
    },
  });

  return result;
};




const updateAdmin = async (
  payload: {
    name?: string;
    image?: string;
    address?: string;
    phone?: string;
  },
  files: any,
  userData: IAuthUser,
) => {
  // Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });

  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, "Admin doesn't exist!");
  }

  // Handle image upload
  const image = files?.image?.[0]?.path || "";

  if (image) {
    payload.image = image;
  }

  // Update admin data
  const result = await prisma.admin.update({
    where: {
      email: admin.email,
    },
    data: payload,
  });

  return result;
};





//update vendor
const updateVendor = async (
  payload: {
    name?: string;
    shopName?: string;
    logo?: string;
    description?: string;
  },files: any, 
  userData: IAuthUser,
) => {
  const vendor = await prisma.vendor.findUnique({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });
 
  if (!vendor) {
    throw new AppError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }
  const image = files?.image?.[0]?.path || "";
  if(image){
    payload.logo = image
  }
  // console.log(payload,"jjj");
  
  const result = await prisma.vendor.update({
    where: {
      email: vendor.email,
    },
    data: payload,
    include: {
      orders: true,
      products: true,
      followers: true,
    },
  });
// console.log(result);

  return result;
};


// all user (search)


const getAllFromDB = async (filters: { searchTerm?: string; role?: string },
  options: { page: number; limit: number }) => {
  const { page, limit } = options;
  const { searchTerm, role } = filters;

  let where: any = {};

  // Search filter
  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.trim().toLowerCase();
      where.OR = [
      {
        email: {
          contains: term,
          mode: "insensitive",
        },
      },
    ];

  
    const upperTerm = term.toUpperCase();
    if (["ADMIN", "VENDOR", "CUSTOMER"].includes(upperTerm)) {
      where.OR.push({
        role: upperTerm,
      });
    }

    if (!role || role === "ADMIN") {
      where.OR.push({
        admin: {
          name: { contains: term, mode: "insensitive" },
        },
      });
    }
    if (!role || role === "VENDOR") {
      where.OR.push({
        vendor: {
          name: { contains: term, mode: "insensitive" },
        },
      });
    }
    if (!role || role === "CUSTOMER") {
      where.OR.push({
        customer: {
          name: { contains: term, mode: "insensitive" },
        },
      });
    }
  }

  // Role filter
  if (role && role.trim() !== "") {
    where.role = role;
  }

  const users = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { 
      admin: true, 
      vendor: {
        include:{
          orders:true,
          products:true,
          followers:true
        }
      }, 
      customer:  {
        include:{
          orders:true,
          following:true,
        }
      }, 
    
    },
  });

  const totalUsers = await prisma.user.count({ where });
  // console.log(users);

  return {
    data: users,
    meta: {
      total: totalUsers,
      page,
      limit,
      totalPage: Math.ceil(totalUsers / limit),
    },
  };
};




//update status
export const updateUserStatus = async (userId: string, status: UserStatus) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
// console.log(status,"status");

  // If user does not exist, throw an error
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: 'BLOCKED' },
  });
  
  if (updatedUser.status !== 'BLOCKED') {
    console.error("User status update failed");
  }
  

  return updatedUser;  // Return the updated user object
};


export const deleteUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      vendor: true,
      customer: true,
      admin: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }


  const email = user.email;

  // Delete Vendor
  await prisma.vendor.deleteMany({
    where: { email },
  });

  // Delete Customer
  await prisma.customer.deleteMany({
    where: { email },
  });

  // Delete Admin
  await prisma.admin.deleteMany({
    where: { email },
  });

  // Delete ReviewReplies linked to user
  await prisma.reviewReply.deleteMany({
    where: { userId },
  });

  
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  return deletedUser;
};



const updateVendorStatus = async (vendorId: string, isDeleted: boolean) => {

  
  try {

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include:{user:true}
    });


    if (!vendor) {
      throw new Error("Vendor not found");
    }
 
    
    const result = await prisma.$transaction([
      // Update vendor isDeleted
      prisma.vendor.update({
        where: { id: vendorId },
        data: { isDeleted },
      }),
      
      // Update user status
      prisma.user.update({
        where: { email: vendor.email }, // Use email as relation field
        data: { 
          status: isDeleted ? 'DELETED' : 'ACTIVE' 
        },
      })
    ]);

    return result[0]; 
   
  } catch (error) {
    throw error; 
  }
};




const getPublicVendors = async (filters?: any) => {
  const { searchTerm, limit = 6, page = 1, categoryId } = filters || {};

  let where: any = {
    role: "VENDOR",
    status: "ACTIVE",
    vendor: {
      isDeleted: false, 
    },
  };

 if (categoryId) {
  where.vendor.products = {
    some: {
      categoryId: categoryId,
      isDeleted: false,
    },
  };
}

  // Search filter
  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.trim().toLowerCase();
    where.OR = [
      { email: { contains: term, mode: "insensitive" } },
      {
        vendor: {
          name: { contains: term, mode: "insensitive" },
        },
      },
      {
        vendor: {
          shopName: { contains: term, mode: "insensitive" },
        },
      },
    ];
  }

  const vendors = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      vendor: {
        select: {
          id: true,
          name: true,
          email: true,
          shopName: true,
          logo: true,
          description: true,
          _count: {
            select: {
              products: true,
              followers: true,
            },
          },

          followers: { select: { customerId: true } }
        },
      },
    },
  });

  const totalVendors = await prisma.user.count({ where });

  return {
    data: vendors,
    meta: {
      total: totalVendors,
      page,
      limit,
      totalPage: Math.ceil(totalVendors / limit),
    },
  };
};



export const userService = {
  createAdmin,
  createVendor,
  createCustomer,
  getMyProfile,
  getVendorUser,
  getCustomerUser,
  followVendor,
  unfollowVendor,
  updateCustomer,
  updateVendor,
  getAllFromDB, 
  updateUserStatus,
  deleteUser,
  updateVendorStatus,
  getPublicVendors,
  updateAdmin,
  
};