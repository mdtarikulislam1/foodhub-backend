import { Router } from "express";
import { dietController } from "./diets.controller";


const router = Router();

router.post("/", dietController.createDiet);
router.get("/", dietController.getAllDiets);

export const dietRouter:Router = router;