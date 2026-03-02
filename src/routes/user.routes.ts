import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateRequest } from "../middlewares/validation.middleware";
import { userAuthRegisterVaildator } from "../validators/usersApis.validators";


const router = Router();
const userController = new UserController();

// Get all users
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Create new user
router.post(
  "/",
  validateRequest(userAuthRegisterVaildator),
  userController.createUser,
);

// Delete user
router.delete("/:id" , userController.deleteUser);

export default router;
