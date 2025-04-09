import { EnvsConst } from "@/core/constants";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export interface UploadImageOptions {
  filePath: Buffer;
  folder: string;
}

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: EnvsConst.CLOUDINARY_CLOUD_NAME,
      api_key: EnvsConst.CLOUDINARY_API_KEY,
      api_secret: EnvsConst.CLOUDINARY_API_SECRET,
    });
  }

  public async uploadImage(
    options: UploadImageOptions
  ): Promise<UploadApiResponse | undefined> {
    const { filePath, folder } = options;

    return await new Promise<UploadApiResponse | undefined>((resolve) => {
      cloudinary.uploader
        .upload_stream(
          { folder: folder, resource_type: "auto", public_id: "sample_id" },
          (error, result) => {
            if (error) {
              return resolve(undefined);
            }
            resolve(result);
          }
        )
        .end(filePath);
    });
  }
}
