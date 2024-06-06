import { S3 } from "aws-sdk";
import fs from "node:fs";
import logger from "../config/logger";
const Logger = logger("aws.handler");

export const awsS3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_S3_ID,
  secretAccessKey: process.env.AWS_S3_SECRET,
});

export const uploadImageToS3 = async (
  key: string,
  filePath: string
): Promise<string> => {
  Logger("uploadImageToS3").debug("");

  const s3 = new S3();
  const fileStream = fs.createReadStream(filePath);

  const parameters = {
    Bucket: process.env.AWS_S3_BUCKET as string,
    Key: key,
    Body: fileStream,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(parameters).promise();
    return data.Location;
  } catch (error) {
    Logger("uploadImageToS3").error(error);
    throw error;
  }
};
