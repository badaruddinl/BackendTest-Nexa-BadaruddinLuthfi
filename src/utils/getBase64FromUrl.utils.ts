import { StatusCodes } from "http-status-codes";
import Jimp from "jimp";

export async function getBase64FromUrl(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const image = await Jimp.read(buffer);
    image.resize(200, Jimp.AUTO);
    image.quality(50);
    const compressedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    const base64Data = compressedBuffer.toString("base64");

    return {
      statusCodes: StatusCodes.OK,
      success: true,
      code: "00",
      message: "is valid URL Photo",
      data: { photo: base64Data, mimeType: "image/jpeg" },
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
