import { Router } from "express";
import { getAllUsers } from "../constrollers/user.controller";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const users = await getAllUsers();
    res.json({ data: users });
  } catch (error) {
    console.log("error fetching user", error);
    res.status(500).json({ error: "failed to fetch users" });
  }
});

export default router;
