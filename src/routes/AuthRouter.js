import { Router } from "express";
import { SignUp, SignIn } from "../controllers/AuthController";

const router = Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);

export default router;
