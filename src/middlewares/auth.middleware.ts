import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt/jwtHelpers";


export function requireAuth(req: Request, res: Response, next: NextFunction): void;
export function requireAuth(requiredRoleId?: number): (req: Request, res: Response, next: NextFunction) => void;
export function requireAuth(arg1?: any, arg2?: any, arg3?: any) {
  if (typeof arg1 === "number") {
    const requiredRoleId = arg1 as number;
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || typeof authHeader !== "string") {
        return res.status(401).json({ message: "Authorization header missing" });
      }
      const parts = authHeader.split(" ");
      if (parts.length !== 2) {
        return res.status(401).json({ message: "Invalid authorization format" });
      }
      const [scheme, token] = parts;
      if (scheme.toLowerCase() !== "bearer" || !token) {
        return res.status(401).json({ message: "Invalid authorization format" });
      }
      try {
        // console.log(requiredRoleId)
        const decoded = verifyAccessToken(token);
        const roleId = (decoded as any)?.userRole?.id ?? (decoded as any)?.role ?? null;

        if (requiredRoleId != null && roleId !== requiredRoleId) {
          return res.status(403).json({ message: "Forbidden" });
        }
        (req as any).user = { ...(decoded as any), id: (decoded as any).id };
        return next();
      } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    };
  } else {
    const req = arg1 as Request;
    const res = arg2 as Response;
    const next = arg3 as NextFunction;
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== "string") {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }
    const [scheme, token] = parts;
    if (scheme.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }
    try {
      const decoded = verifyAccessToken(token);
      (req as any).user = { ...(decoded as any), id: (decoded as any).id };
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
}
