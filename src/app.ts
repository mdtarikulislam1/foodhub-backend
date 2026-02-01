import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import { auth } from "./lib/auth";

import { notFound } from "./middleware/notFound";
import { userRouter } from "./modules/user/user.router";
import { brandRouter } from "./modules/brand/brand.router";
import errorHandler from "./middleware/error/globalErrorHandler";
import { categoryRouter } from "./modules/category/category.router";

const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("FoodHub Backend is running");
});

app.use(notFound);
app.use(errorHandler);
export default app;
