import { Router } from "express";
import { userController } from "../controller";
import { userValidation } from "../validations";
import validate from "../middlewares/validate";
import isRegisteredValidate from "../middlewares/is-registered";

const router = Router();

router.get("/", userController.getAll);
router.post(
  "/signup",
  validate(userValidation.signupSchema),
  isRegisteredValidate,
  userController.create
);
router.post(
  "/login",
  validate(userValidation.signinSchema),
  userController.login
);

export default router;
