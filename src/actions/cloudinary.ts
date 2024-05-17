"use server";

import cloud from "@/configs/cloudinary";

export const uploadImage = async (image: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloud.uploader.upload(image, options);
    return { id: result.public_id, url: result.secure_url };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAssetInfo = async (publicId: string) => {
  const options = {
    colors: true,
  };

  try {
    const result = await cloud.api.resource(publicId, options);
    console.log(result);
    return result.colors;
  } catch (error) {
    console.error(error);
    return null;
  }
};
