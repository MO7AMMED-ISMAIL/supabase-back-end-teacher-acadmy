import { Router } from "express";
import userRoutes from "./user";
// import productRoutes from "./product"; // add more routes here

const router = Router();

router.use("/users", userRoutes);
// router.use("/products", productRoutes);

export default router;