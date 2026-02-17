/**
 * S3のimage_urlからcoordinate IDを抽出する
 * 例: "https://bucket.s3.region.amazonaws.com/images/2026-02-17/20260217_214300_a1b2c3d4.png"
 *   → "20260217_214300_a1b2c3d4"
 */
export function extractCoordinateId(imageUrl: string): string {
  const filename = imageUrl.split('/').pop() ?? ''
  return filename.replace(/\.[^.]+$/, '')
}
