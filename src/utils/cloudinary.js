/**
 * Utility to upload images to Cloudinary using the Unsigned Upload API.
 * 
 * @param {File} file - The image file to upload.
 * @param {string} cloudName - Your Cloudinary Cloud Name.
 * @param {string} uploadPreset - Your Unsigned Upload Preset name.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dabzehltj";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "furniro_preset";

  if (!cloudName || cloudName === "YOUR_CLOUD_NAME") {
    throw new Error("Cloudinary Cloud Name is not configured.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Failed to upload image to Cloudinary.");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
