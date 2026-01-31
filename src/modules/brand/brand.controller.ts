import { Request, Response } from "express";

const createBrand = async (req:Request, res:Response,next: Function) => {
    try {
        res.status(200).json({message: "Brand endpoint", status: true});
    } catch (e) {
        next(e);
    }
}

export const brandController = {
    createBrand,
};