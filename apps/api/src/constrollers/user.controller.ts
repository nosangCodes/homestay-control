import { client } from "../db/client";

export const getAllUsers = async () => {
  try {
    const users = await client.user.findMany();
    return users;
  } catch (error) {
    console.error("error fetching users", error);
    throw error;
  }
};
