import { Room, RoomImage } from "@repo/db";
import { client } from "../db/client";
import { CreateRoomRequest } from "../types";

const create = async (data: CreateRoomRequest) => {
  try {

    const facilityConnections = data.facilities.map((facilityId) => ({
      facility: {
        connect: { id: facilityId.id }, // Connect each facility by its ID
      },
    }));
    const newRoom = await client.room.create({
      data: {
        ...data,
        facilities: {
          create: facilityConnections,
        },
      },
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

const addFacilities = async (data: {
  roomId: number;
  facilities: number[];
}) => {
  try {
    const createData = data.facilities.map((id) => ({
      roomId: data.roomId,
      facilityId: id,
    }));
    const result = await client.roomFacility.createMany({
      data: createData,
    });
  } catch (error) {
    console.error("[ERROR ADDING FACILITIES]");
    throw error;
  }
};

const checkfacilities = async (data: { facilities: number[] }) => {
  try {
    const facilities = await client.facility.findMany({
      where: {
        id: { in: data.facilities },
      },
    });
    console.log("🚀 ~ checkfacilities ~ facilities:", facilities);
    return facilities;
  } catch (error) {
    console.error("[ERROR FETCHING FACILITIES]");
    throw error;
  }
};

const getFacilities = async () => {
  try {
    const facilities = await client.facility.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return facilities;
  } catch (error) {
    console.error("[ERROR FETCHING FACILITIES]", error);
    throw error;
  }
};
export { create, addImages, getFacilities, checkfacilities };
