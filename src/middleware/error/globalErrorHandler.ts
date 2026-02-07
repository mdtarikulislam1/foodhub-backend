import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "./app.error";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // AppError FIRST
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message, // REAL MESSAGE
    });
  }

  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails: any = err;

  // PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided an incorrect field type or missing fields.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Map common Prisma error codes to user-friendly messages and HTTP statuses
    const code = err.code;
    switch (code) {
      case "P2025":
        statusCode = 404;
        errorMessage = "Record not found or already deleted.";
        break;
      case "P2002":
        statusCode = 409;
        errorMessage = "Duplicate value detected. This record already exists.";
        break;
      case "P2003":
        statusCode = 400;
        errorMessage = "Invalid reference. Related record does not exist.";
        break;
      case "P2001":
        statusCode = 404;
        errorMessage = "Requested record does not exist.";
        break;
      case "P2000":
        statusCode = 400;
        errorMessage = "Input value is too long for this field.";
        break;
      case "P2004":
        statusCode = 400;
        errorMessage = "A database constraint failed.";
        break;
      case "P2005":
        statusCode = 500;
        errorMessage = "Database query failed. Please try again later.";
        break;
      case "P2009":
        statusCode = 400;
        errorMessage = "Failed to validate query or value.";
        break;
      case "P2011":
        statusCode = 400;
        errorMessage = "Required field is missing or contains null value.";
        break;
      case "P2014":
        statusCode = 400;
        errorMessage = "Invalid relation. This operation violates a required relation.";
        break;
      case "P2016":
        statusCode = 400;
        errorMessage = "Query interpretation error. Please check request data.";
        break;
      case "P2022":
        statusCode = 400;
        errorMessage = "The operation attempted is not allowed on this Prisma model.";
        break;
      case "P2034":
        statusCode = 409;
        errorMessage = "Transaction failed due to a write conflict. Please retry.";
        break;
      default:
        statusCode = 400;
        errorMessage = `${err.message || "Database error"} (${code})`;
    }

    // Provide structured error details for debugging (code + meta)
    errorDetails = {
      code: err.code,
      meta: (err as any).meta ?? null,
      message: err.message,
    };
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    console.error("Prisma Unknown Error:", err);
    statusCode = 500;
    errorMessage = "Unexpected database error occurred. Please try again later.";
    errorDetails = { message: err.message };
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error("Prisma Initialization Error:", err);
    statusCode = 500;
    errorMessage = "Database service is temporarily unavailable. Please try again later.";
    errorDetails = { message: err.message };
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    errorDetails: errorDetails,
  });
}

export default errorHandler;
