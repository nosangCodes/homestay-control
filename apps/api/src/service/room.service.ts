import { Room, RoomImage } from "@repo/db";
import { client } from "../db/client";
import { CreateRoomRequest } from "../types";
import { generateImageLinkSingle } from "../aws/aws-service";

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

const get = async (currentPage = 1, pageSize = 5) => {
  try {
    const roomsCount = await client.room.count();
    const totalPages = Math.ceil(roomsCount / pageSize);
    const rooms = await client.room.findMany({
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        facilities: {
          select: {
            facility: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const formattedRooms = await Promise.all(
      rooms.map(async (room) => ({
        ...room,
        facilities: room.facilities.map((facility) => facility.facility.name),
        thumbnailName: await generateImageLinkSingle(room.thumbnailName),
      }))
    );
    return {
      rooms: formattedRooms,
      metadata: {
        currentPage,
        pageSize,
        totalPages,
      },
    };
  } catch (error) {
    console.error("[FAILED TO FETCH ROOMS]", error);
    throw error;
  }
};

const getById = async (id: number) => {
  try {
    const room = await client.room.findUnique({
      where: { id },
      include: {
        facilities: {
          select: {
            facility: true,
          },
        },
        images: true,
      },
    });

    const formattedRoom = {
      ...room,
      facilities: room?.facilities.map((facility) => facility.facility.name),
      thumbnailName: room?.thumbnailName
        ? await generateImageLinkSingle(room?.thumbnailName).catch((err) => {
            console.error("Error generating thumbnail link:", err);
            return "";
          })
        : "",
      images: room?.images
        ? await Promise.all(
            room.images.map(async (image) => {
              return await generateImageLinkSingle(image.name).catch((err) => {
                console.error("Error generating image link:", err);
                return "";
              });
            })
          )
        : [],
    };
    return formattedRoom;
  } catch (error) {
    console.error("[FAILED TO FETCH ROOMS]", error);
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
export { create, addImages, getFacilities, checkfacilities, get, getById };
