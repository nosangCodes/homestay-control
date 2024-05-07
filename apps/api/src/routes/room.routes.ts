import { Router } from "express";
import validate from "../middlewares/validate";
import { roomValidation } from "../validations";
import { roomController } from "../controller";
import { imageUpload } from "../multer/service";

const router = Router();

router.post(
  "/",
  imageUpload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "image",
    },
  ]),
  validate(roomValidation.create),
  roomController.create
);

export default router;
