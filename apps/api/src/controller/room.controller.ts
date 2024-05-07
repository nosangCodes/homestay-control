import { Request, Response } from "express";
import handleAsync from "../utils/handleAsync";
import { Room } from "@repo/db";
import { roomService } from "../service";
import { s3UploadMultiple, s3UploadSingle } from "../aws/aws-service";

const create = handleAsync(
  async (req: Request<{}, {}, Room>, res: Response) => {
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

      const newRoom = await roomService.create(req.body);

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

export { create };
