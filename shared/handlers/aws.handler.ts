/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "node:fs";
import logger from "../config/logger";
const Logger = logger("aws.handler");

const s3Client: S3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET as string,
  },
});

export const uploadImageToS3 = async (
  key: string,
  filePath: string
): Promise<string> => {
  Logger("uploadImageToS3").debug("");

  const fileStream = fs.createReadStream(filePath);

  const upload = new Upload({
    client: s3Client,
    params: {
      ACL: "public-read",
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: key,
      Body: fileStream,
    },
  });

  try {
    await upload.done();
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    Logger("uploadImageToS3").error(error);
    throw error;
  }
};
