import { Request, Response } from "express";
import handleAsync from "../utils/handleAsync";
import { Facility, Room } from "@repo/db";
import { roomService } from "../service";
import { s3UploadMultiple, s3UploadSingle } from "../aws/aws-service";
import { CreateRoomRequest } from "../types";

const create = handleAsync(
  async (req: Request<{}, {}, CreateRoomRequest>, res: Response) => {
    try {
      const files = req.files as {
        thumbnail: Express.Multer.File[];
        image?: Express.Multer.File[];
      };

      if (!files.thumbnail[0]) {
        return res.status(400).json({ message: "no file uploaded" });
      }

      const singleFileResult = await s3UploadSingle(files.thumbnail[0]);
      Object.assign(req.body, { thumbnailName: singleFileResult.fileName });

      const newRoom = await roomService.create({
        ...req.body,
      });

      let multipleFileresult: {
        status: number | undefined;
        fileNames: string[];
      } | null = null;

      if (files.image && files.image?.length > 0) {
        multipleFileresult = await s3UploadMultiple(files.image);
        await roomService.addImages({
          names: multipleFileresult.fileNames,
          roomId: newRoom.id,
        });
        console.log("🚀 ~ multipleFileresult:", multipleFileresult);
      }

      res.json({
        message: "room created",
        data: {
          id: newRoom.id,
          title: newRoom.title,
          thumnail: newRoom.thumbnailName,
          files: multipleFileresult?.fileNames,
        },
      });
    } catch (error) {
      console.log("[ERROR CREATING ROOM]", error);
      res.status(500).json({ messahe: "Internal server error" });
    }
  }
);

const get = handleAsync(
  async (
    req: Request<{}, {}, {}, { page?: string; pageSize?: string }>,
    res: Response
  ) => {
    try {
      const { page, pageSize } = req.query;
      const rooms = await roomService.get(
        parseInt(page ? page : "1"),
        parseInt(pageSize ? pageSize : "5")
      );
      res.json({ message: "rooms fetched", data: rooms });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const getRoomById = handleAsync(
  async (req: Request<{ id: number }, {}, {}>, res: Response) => {
    try {
      const { id } = req.params;
      const room = await roomService.getById(id);
      res.json({ message: "room fetched", data: room });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

const getFacilities = handleAsync(async (req: Request, res: Response) => {
  try {
    const facilities = await roomService.getFacilities();
    res.json({ message: "facilities fetched", data: facilities });
  } catch (error) {
    console.log("[ERROR FETCHING FACILITIES]", error);
    res.status(500).json({ messahe: "Internal server error" });
  }
});

const checkfacilities = handleAsync(
  async (req: Request<{}, {}, { facilities: number[] }>, res: Response) => {
    try {
      const facilities = await roomService.checkfacilities({
        facilities: req.body.facilities,
      });
      res.json(facilities);
    } catch (error) {
      console.log("[ERROR CHECKING  FACILITIES]", error);
      res.status(500).json({ messahe: "Internal server error" });
    }
  }
);

export { create, getFacilities, checkfacilities, get, getRoomById };
