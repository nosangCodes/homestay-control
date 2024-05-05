import { Response } from "express";
import { userService } from "../service/index";
import handleAsync from "../utils/handleAsync";

const getAll = handleAsync(async (_: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ data: users });
  } catch (error) {
    console.log("error fetching user", error);
    res.status(500).json({ error: "failed to fetch users" });
  }
});
export { getAll };
