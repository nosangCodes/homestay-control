import { Room, RoomImage } from "@repo/db";
import { client } from "../db/client";

const create = async (data: Room) => {
  try {
    const newRoom = await client.room.create({
      data,
    });
    if (!newRoom) {
      throw new Error("Failed to create new room.");
    }

    return newRoom;
  } catch (error) {
    console.error("[ERROR CREATING ROOM]", error);
    throw error;
  }
};

const addImages = async (data: { roomId: number; names: string[] }) => {
  try {
    const createData = data.names.map((name) => ({
      roomId: data.roomId,
      name,
    }));
    const roomImages = await client.roomImage.createMany({
      data: createData,
    });
    return roomImages;
  } catch (error) {
    console.error("[ERROR ADDING ROOM IMAGES]", error);
    throw error;
  }
};

export { create, addImages };
