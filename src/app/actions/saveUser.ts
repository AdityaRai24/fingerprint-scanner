"use server";

import { supabase } from "@/lib/supabase";
import sharp from "sharp";

async function imageHash(base64: string) {
  const buffer = Buffer.from(base64.split(",")[1], "base64");
  const resized = await sharp(buffer).resize(8, 8).grayscale().raw().toBuffer();
  // Simple average hash: each pixel > mean is 1, else 0
  const mean = resized.reduce((a, b) => a + b, 0) / resized.length;
  let hash = "";
  for (const pixel of resized) {
    hash += pixel > mean ? "1" : "0";
  }
  // Pad to 64 bits if needed
  return hash.padStart(64, "0");
}

export async function saveUser({
  firstName,
  lastName,
  address,
  additionalInfo,
  faceImage,
  thumbImage,
}: {
  firstName: string;
  lastName: string;
  address: string;
  additionalInfo: string;
  faceImage?: string;
  thumbImage?: string;
}) {
  // Compute hashes if images are provided
  const faceHash = faceImage ? await imageHash(faceImage) : null;
  const thumbHash = thumbImage ? await imageHash(thumbImage) : null;

  console.log('Generated hashes:', { faceHash, thumbHash });

  const { data, error } = await supabase.from("users").insert([
    {
      first_name: firstName,
      last_name: lastName,
      address,
      additional_info: additionalInfo,
      face_image: faceImage,
      thumb_image: thumbImage,
      face_hash: faceHash,
      thumb_hash: thumbHash,
    },
  ]);
  if (error) {
    console.error('Error saving user:', error);
    throw error;
  }
  return data;
}
