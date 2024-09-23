import { eq } from "drizzle-orm";
import { users } from "../schema";
import { db } from "@/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      //   with: {
      //     accounts: true,
      //   },
    });
    return user;
  } catch (error) {
    console.error("Error occurred at getUserByEmail ", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      //   with: {
      //     accounts: true,
      //   },
    });
    return user;
  } catch (error) {
    console.error("Error occurred at getUserById ", error);
    throw error;
  }
};
