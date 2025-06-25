import { StatusCodes } from "http-status-codes";
import sharp from "sharp";

async function getBase64FromUrl(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch image, status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";

    const buffer = Buffer.from(await res.arrayBuffer());

    const compressedBuffer = await sharp(buffer)
      .resize(200) // contoh resize width 200px
      .jpeg({ quality: 50 })
      .toBuffer();

    const base64Data = compressedBuffer.toString("base64");

    return {
      statusCodes: StatusCodes.CREATED,
      success: true,
      code: "00",
      message: "is valid URL Photo",
      data: { photo: base64Data, mimeType: contentType },
    };
  } catch (error) {
    return {
      statusCodes: StatusCodes.BAD_REQUEST,
      success: false,
      code: "01",
      message: "Invalid photo URL",
    };
  }
}

export { getBase64FromUrl };
