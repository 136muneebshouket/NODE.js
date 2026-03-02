import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";
import { CreateUserDto, UpdateUserDto } from "../types/user.dto";
import { ValidationException } from "../shared/exceptions/validation-exception";
import { HttpException } from "../shared/exceptions/http-exception";

export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  getAllUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      this.sendSuccess(res, users, "Users retrieved successfully");
    } catch (error) {
      console.error("Error getting users:", error);
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
 
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        next(
          new ValidationException({
            message: "Validation failed",
            violations: [{ msg: "Invalid user ID", param: "id" }],
          }),
        );
        return;
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        next(
          new HttpException({
            message: "User not found",
            status: 404,
          }),
        );
        return;
      }

      this.sendSuccess(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
      console.error("Error getting user:", error);
    }
  };

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
    
      const existingUser = await this.userService.findByEmail(userData.email);
      if (existingUser) {
        next(
          new HttpException({
            message: "Email already exists",
            status: 409,
          }),
        );
        return;
      }

      const user = await this.userService.createUser(userData);
      const userResponse = await this.userService.getUserById(user.id);

      this.sendSuccess(res, userResponse, "User created successfully", 201);
    } catch (error) {
      next(error);
      console.error("Error creating user:", error);
      this.sendError(res, "Failed to create user");
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        next(
          new ValidationException({
            message: "Validation failed",
            violations: [{ msg: "Invalid user ID", param: "id" }],
          }),
        );
        return;
      }

      const userData: UpdateUserDto = req.body;

      // Check if email is being updated and if it already exists
      if (userData.email) {
        const existingUser = await this.userService.findByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          next(
            new HttpException({
              message: "Email already exists",
              status: 409,
            }),
          );
          return;
        }
      }

      const [affectedCount] = await this.userService.updateUser(id, userData);
      if (affectedCount === 0) {
        next(
          new HttpException({
            message: "User not found",
            status: 404,
          }),
        );
        return;
      }

      const updatedUser = await this.userService.getUserById(id);
      this.sendSuccess(res, updatedUser, "User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      next(error);
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        next(
          new ValidationException({
            message: "Validation failed",
            violations: [{ msg: "Invalid user ID", param: "id" }],
          }),
        );
        return;
      }

      const affectedRows = await this.userService.delete(id);
      if (affectedRows === 0) {
        next(
          new HttpException({
            message: "User not found",
            status: 404,
          }),
        );
        return;
      }

      this.sendSuccess(res, null, "User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      next(error);
    }
  };
}
