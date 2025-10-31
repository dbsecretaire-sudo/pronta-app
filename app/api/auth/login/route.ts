import { Request, Response } from "express";
import { loginController } from './controller';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginController(req.body); // Passe req.body au lieu de req
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : "Login failed" });
  }
};
