export default function getImageSrcByBucketAndFileNames({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}): string {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/files/${bucketName}/${fileName}`;
}
