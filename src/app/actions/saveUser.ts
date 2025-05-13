"use server";

import { supabase } from "@/lib/supabase";
import sharp from "sharp";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";

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
  // Get the current session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }

  // Get the auth ID from the database using the email
  const { data: authUser, error: authError } = await supabase
    .from('auth')
    .select('id')
    .eq('email', session.user.email)
    .single();

  if (authError || !authUser) {
    console.error('Error fetching auth user:', authError);
    throw new Error("Failed to get user authentication details");
  }

  // Compute hashes if images are provided
  const faceHash = faceImage ? await imageHash(faceImage) : null;
  const thumbHash = thumbImage ? await imageHash(thumbImage) : null;

  console.log('Generated hashes:', { faceHash, thumbHash });

  const { data, error } = await supabase.from("users").insert([
    {
      auth_id: authUser.id,
      first_name: firstName,
      last_name: lastName,
      address,
      additional_info: additionalInfo,
      face_image: faceImage,
      thumb_image: thumbImage,
      face_hash: faceHash,
      thumb_hash: thumbHash,
    },
  ]).select();

  if (error) {
    console.error('Error saving user:', error);
    throw error;
  }
  return data;
}
