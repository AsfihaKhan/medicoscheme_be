import { Router } from "express";
import AuthRouter from "./AuthRouter";
import AppRouter from "./AppRouter";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/app", AppRouter);

export default router;
