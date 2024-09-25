/* import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const POST = async (request: Request) => {
  const { fileName, fileType } = await request.json();

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    //    credentials: {
    //  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // },
  });

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    // Create a presigned URL for uploading the file
    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return Response.json(uploadUrl);
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
  }
};
 */
