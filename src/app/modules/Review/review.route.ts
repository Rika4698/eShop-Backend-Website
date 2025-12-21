import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post(
    "/create-review", 
    auth(UserRole.CUSTOMER), 
    ReviewController.createReview
);


router.post(
    "/create-reply", 
    auth(UserRole.VENDOR),
    ReviewController.createReply
);


router.get(
    "/all-review",
    auth(UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN), 
    ReviewController.getAllReviews
);

export const ReviewRoutes = router;