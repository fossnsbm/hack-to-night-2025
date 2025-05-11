"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("teamId");
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Failed to log out" };
  }
} 