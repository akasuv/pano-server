import { NextFunction, Request, Response } from "express";
import Pano from "@/pano";

const instance = new Pano();

const pano = (req: Request, res: Response, next: NextFunction) => {
  req.pano = instance;
  next();
};

export { pano };
