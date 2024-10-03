import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  // Get query parameters
  const fileName = searchParams.get("fileName");
  const fileType = searchParams.get("fileType");

  if (!fileName || !fileType) {
    return NextResponse.json(
      { message: "Missing fileName or fileType" },
      { status: 400 }
    );
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
    Conditions: [["content-length-range", 0, MAX_SIZE_BYTES]],
  };

  try {
    // Generate presigned URL for PUT (upload) operation
    const url = await getSignedUrl(s3Client, new PutObjectCommand(params), {
      expiresIn: 60,
    });

    return NextResponse.json(url);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate presigned URL", error: error.message },
      { status: 500 }
    );
  }
};
