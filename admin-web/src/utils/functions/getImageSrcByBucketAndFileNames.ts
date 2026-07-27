import { API_BASE_URL } from "../contants/environmentConstants.ts";

export default function getImageSrcByBucketAndFileNames({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}): string {
  return `${API_BASE_URL}/files/${bucketName}/${fileName}`;
}
