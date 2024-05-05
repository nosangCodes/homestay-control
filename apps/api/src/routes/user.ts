import { Response, Router } from "express";
import { userController } from "../controller";
import { userValidation } from "../validations";
import validate from "../middlewares/validate";
import handleAsync from "../utils/handleAsync";

const router = Router();

router.get("/", validate(userValidation.signupSchema), userController.getAll);
router.post(
  "/signup",
  validate(userValidation.signupSchema),
  async (_, res: Response) => {
    try {
      res.json({ message: "sign up successful" });
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  }
);

export default router;
