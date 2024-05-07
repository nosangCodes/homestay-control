import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3Client from "./client";

const bucketName = process.env.AWS_BUCKET_NAME as string;

export const s3UploadSingle = async (file: Express.Multer.File) => {
  try {
    const fileName = `${uuidv4()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Key: fileName,
      Bucket: bucketName,
      Body: file.buffer,
    });

    const result = await s3Client.send(command);
    console.log("🚀 ~ s3UploadSingle ~ result:", result);
    return { status: result.$metadata.httpStatusCode, fileName };
  } catch (error) {
    throw error;
  }
};

export const s3UploadMultiple = async (files: Express.Multer.File[]) => {
  try {
    let fileNames: string[] = [];
    const commands = files.map((file) => {
      fileNames.push(`${uuidv4()}-${file.originalname}`);
      return new PutObjectCommand({
        Key: `${uuidv4()}-${file.originalname}`,
        Bucket: bucketName,
        Body: file.buffer,
      });
    });
    const results = await Promise.all(
      commands.map((command) => s3Client.send(command))
    );
    return { status: results[0].$metadata.httpStatusCode, fileNames };
  } catch (error) {
    throw error;
  }
};
