# 🛍️ EShop - Modern E-Commerce Platform-Backend

#### Welcome to EShop !
A full-stack e-commerce platform built with **Next.js 16, TypeScript, Prisma, Redux Toolkit (RTK Query), PostgreSQL**. Features multi-vendor support, real-time inventory management, advanced product filtering, and seamless payment integration. EShop is your one-stop online platform for all essential products. We aim to deliver high-quality, nutritious items right to your doorstep, saving you time and effort. Enjoy a seamless shopping experience with fast delivery and affordable prices.

## Backend Live Link: https://eshop-backend-website.onrender.com/

## ✨ Features

### Core Functionality
- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control (Customer, Vendor, Admin)
- 👥 **User Management** - Registration, login, profile management
- 🎯 **Product Management** - Create, update, delete product with image uploads
- 📝 **Category Management** - Create, update, delete category with image uploads
- 📝 **Order System** - Complete order with payment system.
- 💳 **Payment Integration** - Aamarpay payment gateway integration with mastercard and mobile banking.
- 🎫 **Coupon System** - Coupon management for customer order.
- ⭐ **Review System** - Customer review each product.
- 🔔 **Reply System** - Vendor reply customer review .
- 💖**Follow System** - Customer follow vendor shop.
- 🔍 **Advanced Search** - Filter products by category, language

### Admin Features

- Manage user accounts (vendors and customers), including options to suspend or delete accounts.

- Blacklist vendor shops to stop their operations.

- Dynamically manage product categories (add, edit, or delete categories).

- Manage platform content, including vendor shops and product categories.
- Checking review and reply.
- Overview all transactions.
- Update their own profile and password.

### Vendor Features


- Create and manage shop profiles, products, and inventory.

- View order history.
-  Respond to customer reviews.
- Update their own profile and password.


### Customer Features

- Browse, filter, and compare products from multiple vendors.

- Add items to the cart, purchase products, and leave reviews for purchased items.

- Integrate with payment systems like Aamarpay use mastercard or mobile banking for secure transactions.

- Access order history to review past purchases.

- Leave reviews and ratings for purchased products.
- Follow favorite vendor shop.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based user authentication
- **Payment**: Aamarpay (mastercard or mobile banking)
- **File Upload**: Cloudinary
- **Validation**: Zod
- **Security**: bcryptjs for password hashing
- **Session**: express-session

---

## link: How to run the application locally

###  Step 1: Clone the Repository

Clone the repository to your local machine using Git:

```node
git clone <repository-url>
```

###  Step 2: Navigate to the Project Directory

Go to the cloned repository folder:

```node
cd <repository-name>
```

###  Step 3: Install Dependencies

Install the required packages using npm:

```node
npm install
```

###  Step 4: Set up the `.env` File

  ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

 configuration file which is under `./src/config` folder named as `index.ts`.

### Step 5: Generate Prisma Client

Run this command to generate the Prisma client:

```node
npx prisma generate
```


### Step 6: Run Database Migrations

Apply the Prisma migrations to set up the database:

```node
npx prisma migrate dev
```

### Step 7:🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/event_management?schema=public"

# JWT

JWT_ACCESS_SECRET=your_jwt_access_secret_key 
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES=30d


# bcryptjs

BCRYPT_SALT_ROUND=10

EMAIL=your_email@gmail.com
APP_PASS=your_app_password
RESET_PASS_UI_LINK=your_reset_password_url

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

#payment
STORE_ID=your_store_id
SIGNATURE_KEY=your_signature_key
PAYMENT_URL=your_payment_url
PAYMENT_VERIFY_URL=your_payment_verify_url
FRONTEND_URL=your_frontend_url
BACKEND_URL=your_backend_url
```
### 🗄 Database Setup

### Using Prisma Migrate

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

This opens a visual database browser at `http://localhost:5555`

### Database Schema

The database schema is defined in the `prisma/schema/` directory:

- `user.prisma` - User, Customer, Admin, Vendor models
- `product.prisma` - Product , category and recent product view models
- `order.prisma` - Order and order details  models
- `reviews.prisma` - Review and review reply models
- `coupon.prisma` - Coupon and customer coupon models
- `follow.prisma` - follow models
- `enum.prisma` - All enums used across the application


### Step 8: Start the Server

Launch the application in development mode:

```node
npm run dev
```

```node
"prisma": {
    "schema": "./prisma/schema"
  },
  "scripts": {
    "start": "node ./dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only ./src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    //...more scripts
  }
```
The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Production Mode

```bash
# Build the TypeScript code
npm run build

# Run the production server
npm start
```

## 📚 API Documentation

### Base URL

All API endpoints are prefixed with `/api/v1`

```
http://localhost:5000/api/v1
```
### Authentication Endpoints

| Method | Endpoint                | Description               | Auth Required   |
| ------ | ----------------------- | ------------------------- | --------------- |
| `POST` | `/auth/login`           | User login                | No              |
| `POST` | `/auth/refresh-token`   | Refresh access token      | No              |
| `GET`  | `/auth/me`              | Get current user info     | No              |
| `POST` | `/auth/change-password` | Change password           | Yes (All roles) |
| `POST` | `/auth/forgot-password` | Request password reset    | No              |
| `POST` | `/auth/reset-password`  | Reset password with token | No              |

### User Endpoints

| Method   | Endpoint                                | Description                  | Auth Required   |
| -------- | --------------------------              | ---------------------------- | --------------- |
| `POST`   | `/users/create-admin`                   | Create admin user            | No              |
| `POST`   | `/users/create-vendor`                  | Create vendor user           | No              |
| `POST`   | `/users/create-customer`                | Create customer user         | No              |
| `GET`    | `/users/me`                             | Get my profile               | Yes (All roles) |
| `GET`    | `/users/all`                            | Get all type users           | Yes (ADMIN)     |
| `PATCH`  | `/users/update-admin'`                  | Update admin profile         | Yes (ADMIN)     |
| `GET`    | `/users/vendors/all`                    | All vendor shop              | Yes (All roles) |
| `PATCH`  | `/users/update-vendor-status/:vendorId` | Single vendor status updated | Yes (ADMIN)     |
| `PATCH`  | `/users/update-customer`                | Update customer user         | Yes (CUSTOMER)  |
| `PATCH`  | `/users/update-vendor`                  | Update vendor user           | Yes (VENDOR)    |
| `GET`    | `/users/follow`                         | Customer follow shop         | Yes (CUSTOMER)  |
| `DELETE` | `/users/unfollow`                       | Customer unfollow vendor     | Yes (CUSTONER)  |
| `DELETE` | `/users/:userId`                        | Delete user                  | Yes (ADMIN)     |
| `PATCH`  | `/users/:id/status`                     | Change user status           | Yes (ADMIN)     |
| `GET`    | `/users/get-vendor/:vendorId`           | Get single vendor            | Yes (All roles) |
| `GET`    | `/users/get-customer/:email`            | Get single customer          | Yes (All roles) |

### Category Endpoints

| Method   | Endpoint                                | Description            | Auth Required |
| -------- | ----------------------------            | ---------------------- | ------------- |
| `POST`   | `/category/create-category`             | Create category        | Yes (ADMIN)   |
| `GET`    | `/category/all-category`                | Get all category       | No            |
| `PATCH`  | `/category/update-category/:categoryId` | Update each category   | Yes (ADMIN)   |
| `DELETE` | `/category/:categoryId`                 | Delete category        | Yes (ADMIN)   |


### Product Endpoints

| Method   | Endpoint                                 | Description                          | Auth Required |
| -------- | ---------------------------------------- | ------------------------------------ | ------------- |
| `POST`   | `/products/create-product`               | Create product                       | Yes (VENDOR)  |
| `GET`    | `/products/all-product`                  | Get all products(with search/filters)| No            |
| `GET`    | `/products/:productId`                   | Get product by ID                    | No            |
| `PATCH`  | `/products/:productId`                   | Update product                       | Yes (VENDOR)  |
| `POST`   | `/products/duplicate/:productId`         | create duplicate product             | Yes (VENDOR)  |
| `DELETE` | `/products/:productId`                   | Delete product (when no order)       | Yes (VENDOR)  |


### Recent Products Endpoints

| Method   | Endpoint                                 | Description                          | Auth Required |
| -------- | ---------------------------------------- | ------------------------------------ | ------------- |
| `POST`   | `/recent-products/create`                | Create recent product view           | Yes (CUSTOMER)|
| `GET`    | `/recent-products/all`                   | Get all view products                | Yes (CUSTOMER)|
| `DELETE` | `/recent-products`                       |  Delete recent view product          | Yes (CUSTOMER)|


### Order Endpoints

| Method   | Endpoint                                 | Description                          | Auth Required  |
| -------- | ---------------------------------------- | ------------------------------------ | -------------  |
| `POST`   | `/orders/create-order`                   | Create order                         | Yes (CUSTOMER) |
| `GET`    | `/orders/all-order`                      | Get all order                        | YES (All roles)|
| `GET`    | `/orders/transaction/:transactionId`     | Get order transaction Id             | Yes (CUSTOMER) |


### Coupon Endpoints

| Method   | Endpoint                                | Description            | Auth Required  |
| -------- | --------------------------------------- | ---------------------- | -------------  |
| `POST`   | `/coupons/create-coupon`                | Create coupon          | Yes (ADMIN)    |
| `GET`    | `/coupons/all`                          | Get all coupon         | Yes (All roles)|
| `PATCH`  | `/coupons/:couponId`                    | Update each coupon     | Yes (ADMIN)    |
| `DELETE` | `/coupons/:couponId`                    | Delete coupon          | Yes (ADMIN)    |


### Payment Endpoints

| Method   | Endpoint                 | Description                  | Auth Required         |
| -------- | ------------------------ | ---------------------------- | --------------------- |
| `POST`   | `/payments/confirmation` | Create payment confirmation  | No                    |
| `GET`    | `/payments/confirmation` | Get payment confirmation     | Yes (CUSTOMER)        |



### Review Endpoints

| Method | Endpoint                 | Description                    | Auth Required |
| ------ | ------------------------ | ------------------------------ | ------------- |
| `POST` | `/reviews/create-review` | Create review                  | Yes (CUSTOMER)|
| `GET`  | `/reviews/all-review`    | Get all reviews                | Yes(All roles)|
| `GET`  | `/reviews/create-reply`  | Get reviews for an event       | Yes(VENDOR)   |




### Admin Endpoints

| Method   | Endpoint                   | Description                 | Auth Required |
| -------- | -------------------------- | --------------------------- | ------------- |
| `GET`    | `/admin/dashboard/stats`   | Get dashboard statistics    | Yes (ADMIN)   |
| `GET`    | `/admin/events`            | Get all events (admin view) | Yes (ADMIN)   |
| `PATCH`  | `/admin/events/:id`        | Update any event            | Yes (ADMIN)   |
| `PATCH`  | `/admin/events/:id/status` | Update event status         | Yes (ADMIN)   |
| `DELETE` | `/admin/events/:id`        | Delete event                | Yes (ADMIN)   |
| `GET`    | `/admin/statistics/events` | Get event statistics        | Yes (ADMIN)   |
| `GET`    | `/admin/statistics/users`  | Get user statistics         | Yes (ADMIN)   |
| `GET`    | `/admin/statistics/hosts`  | Get host statistics         | Yes (ADMIN)   |

---

## 📁 Project Structure

```
eShop-backend-website/
├─ prisma/
│  └─ schema/
|     ├─ migrations/               # Database migrations
│     ├─ coupon.prisma             # Coupon, customer coupon models
│     ├─ enum.prisma               # All enums
│     ├─ follow.prisma             # Follow model
│     ├─ order.prisma              # Order, Order details models
│     ├─ product.prisma            # Products, category models
│     ├─ reviews.prisma            # Review, Review reply models
│     ├─ schema.prisma
│     └─ user.prisma               # User, Admin, Vendor,Customer models
├─ src/
│  ├─ app/
│  │  ├─ config/
│  │  │  ├─ cloudinary.config.ts     # Cloudinary config
│  │  │  ├─ index.ts                 # Environment config
│  │  │  └─ multer.config.ts         # Multer storage config
│  │  ├─ errors/
│  │  │  └─ appError.ts               # Custom error classes
│  │  ├─ interface/
│  │  │  ├─ file.ts
│  │  │  ├─ index.d.ts
│  │  │  └─ sendResponseInterface.ts
│  │  ├─ middlewares/                    # Express middlewares
│  │  │  ├─ auth.ts                      # JWT authentication
│  │  │  ├─ globalErrorHandler.ts        # Error handling
│  │  │  ├─ notFound.ts
│  │  │  └─ validateRequest.ts            # Auth & validation middleware
│  │  ├─ modules/                         # Feature modules
│  │  │  ├─ Auth/                          # Authentication module
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.interface.ts
│  │  │  │  ├─ auth.route.ts
│  │  │  │  ├─ auth.services.ts
│  │  │  │  └─ auth.validation.ts
│  │  │  ├─ Category/                       # Category management module
│  │  │  │  ├─ category.controller.ts
│  │  │  │  ├─ category.route.ts
│  │  │  │  ├─ category.services.ts
│  │  │  │  └─ category.validation.ts
│  │  │  ├─ Coupon/                         # Coupon management module
│  │  │  │  ├─ coupon.controller.ts
│  │  │  │  ├─ coupon.interface.ts
│  │  │  │  ├─ coupon.route.ts
│  │  │  │  ├─ coupon.service.ts
│  │  │  │  └─ coupon.validation.ts
│  │  │  ├─ Orders/                         # Order management module
│  │  │  │  ├─ order.controller.ts
│  │  │  │  ├─ order.interface.ts
│  │  │  │  ├─ order.route.ts
│  │  │  │  ├─ order.service.ts
│  │  │  │  └─ order.validation.ts
│  │  │  ├─ Payments/                       # Payment management module
│  │  │  │  ├─ payment.controller.ts
│  │  │  │  ├─ payment.route.ts
│  │  │  │  └─ payment.services.ts
│  │  │  ├─ Products/                        # Product management module
│  │  │  │  ├─ product.constant.ts
│  │  │  │  ├─ product.controller.ts
│  │  │  │  ├─ product.interface.ts
│  │  │  │  ├─ product.route.ts
│  │  │  │  ├─ product.services.ts
│  │  │  │  └─ product.validation.ts
│  │  │  ├─ Recent Products/                  # Recent product view management module
│  │  │  │  ├─ recentProduct.controller.ts
│  │  │  │  ├─ recentProduct.route.ts
│  │  │  │  └─ recentProduct.service.ts
│  │  │  ├─ Review/                            # Review management module
│  │  │  │  ├─ review.controller.ts
│  │  │  │  ├─ review.interface.ts
│  │  │  │  ├─ review.route.ts
│  │  │  │  ├─ review.service.ts
│  │  │  │  └─ review.validation.ts
│  │  │  └─ Users/                             # User management module
│  │  │     ├─ user.constant.ts 
│  │  │     ├─ user.controller.ts
│  │  │     ├─ user.interface.ts
│  │  │     ├─ user.route.ts
│  │  │     ├─ user.service.ts
│  │  │     └─ user.validation.ts
│  │  ├─ routes/
│  │  │  └─ index.ts                     # Route aggregator
│  │  └─ utils/
│  │     ├─ calculatePagination.ts       # Pagination utilities
│  │     ├─ catchAsync.ts                # Async error handler
│  │     ├─ jwt.ts                        # JWT utilities
│  │     ├─ payment.ts                    # Aamarpay payment integration
│  │     ├─ pick.ts
│  │     ├─ prisma.ts
│  │     ├─ sendEmail.ts                  # Email sending helper 
│  │     └─ sendResponse.ts               # Response formatter
│  ├─ app.ts                               # Express app setup
│  └─ server.ts                           # Server entry point
├─ .env                                   # Environment variables
├─ .env.example                           # Environment template
├─ .gitignore
├─ confirmation.html                      # Payment confirmation layout
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json                           # TypeScript configuration
```

## Module Structure

Each module follows a consistent structure:

```
module-name/
├── module-name.controller.ts    # Request handlers
├── module-name.service.ts        # Business logic
├── module-name.routes.ts         # Route definitions
├── module-name.validation.ts    # Zod validation schemas
└── module-name.constant.ts      # Constants (if needed)
```

## 🧪 Testing

### Manual Testing with Postman

1. **Import Collection**: Create a Postman collection with all endpoints
2. **Set Base URL**: `http://localhost:5000/api/v1`
3. **Authentication**:
   - Login first to get cookies
   - Postman will automatically include cookies in subsequent requests

## Code Style Guidelines

- Use TypeScript for type safety
- Follow the existing module structure
- Use Zod for validation
- Handle errors with custom `ApiError` class
- Use Prisma transactions for multi-step operations
- Add comments for complex logic
- Keep functions focused and single-purpose



## 👤 Author

**Sharmin Akter Reka**

---