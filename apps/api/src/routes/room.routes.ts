import { Router } from "express";
import validate from "../middlewares/validate";
import { roomValidation } from "../validations";
import { roomController } from "../controller";
import { imageUpload } from "../multer/service";
import isAuthorized from "../middlewares/is-authorized";
import { roomId } from "../validations/room.validation";

const router = Router();

router
  .post(
    "/",
    isAuthorized,
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
  )
  .get("/", isAuthorized, roomController.get)
  .get(
    "/:id",
    isAuthorized,
    validate(roomValidation.roomId),
    roomController.getRoomById
  )
  .put(
    "/:id",
    isAuthorized,
    imageUpload.fields([
      {
        name: "thumbnail",
        maxCount: 1,
      },
      {
        name: "newImage",
      },
    ]),
    validate(roomId),
    roomController.update
  )
  .delete("/:id", roomController.deleteById)
  .get("/get-all-facilities", isAuthorized, roomController.getFacilities)
  .get("/check-facilities", isAuthorized, roomController.checkfacilities)
  .post("/test-token", isAuthorized, (req, res) => {
    res.json({ message: "hello", decodedToken: req.decodedToken });
  });

export default router;
