import 'server-only';

import { eq, sql } from "drizzle-orm";
import { accounts } from "../schema";
import { db } from "@/db";
import type { Account } from "next-auth";
import { env } from "@/lib/env.server";
import type { CredentialRequest } from "google-auth-library";
import { RefreshTokenError } from "@/auth";

// When user logs out, delete all tokens for that account
export const deleteAccountTokens = async (userId: string) => {
  try {
    await db
      .update(accounts)
      .set({
        refreshToken: null,
        accessToken: null,
        expiresAt: null,
        tokenType: null,
        scope: null,
        idToken: null,
        sessionState: null,
      })
      .where(eq(accounts.userId, userId));
    console.log("Deleted tokens for user ", userId);
  } catch (error) {
    console.error("Error occurred at deleteTokens ", error);
    throw error;
  }
};

// Update the account tokens in the database when user signs in again
export const updateAccountTokens = async (account: Account) => {
  try {
    const { provider, providerAccountId } = account;

    const {
      access_token,
      refresh_token,
      expires_at,
      token_type,
      scope,
      id_token,
      session_state,
    } = account;
    await db
      .update(accounts)
      .set({
        refreshToken: refresh_token,
        accessToken: access_token,
        expiresAt: expires_at,
        tokenType: token_type,
        scope,
        idToken: id_token,
        sessionState: session_state as string,
      })
      .where(
        sql`${accounts.provider} = ${provider} AND ${accounts.providerAccountId} = ${providerAccountId}`,
      );
  } catch (error) {
    console.error("Error occurred at updateAccountTokens ", error);
    throw error;
  }
};

// Refresh the access token using the refresh token when access token expires
export const refreshAccessToken = async (
  refreshToken: string,
  userId: string,
) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.AUTH_GOOGLE_ID,
        client_secret: env.AUTH_GOOGLE_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      method: "POST",
    });

    const tokens: CredentialRequest = await response.json();

    if (!response.ok) throw tokens;

    const {
      access_token,
      expires_in = 3599,
      token_type,
      scope,
      id_token,
      refresh_token,
    } = tokens;

    await db
      .update(accounts)
      .set({
        refreshToken: refresh_token ?? refreshToken,
        accessToken: access_token,
        expiresAt: Math.floor(Date.now() / 1000 + expires_in),
        tokenType: token_type,
        scope,
        idToken: id_token,
      })
      .where(
        sql`${accounts.provider} = ${"google"} AND ${
          accounts.userId
        } = ${userId}`,
      );
  } catch (error) {
    const errorObject = error as { error: string; error_description: string };

    if (errorObject?.error === "unauthorized_client") {
      throw new RefreshTokenError(
        `Failed to refresh access token: ${errorObject.error_description}`,
      );
    }
  }
};

// Get the account tokens from the database
export const getAccountByProvider = async (
  provider: string,
  providerAccountId: string,
) => {
  try {
    const user = await db.query.accounts.findFirst({
      where: sql`${accounts.provider} = ${provider} AND ${accounts.providerAccountId} = ${providerAccountId}`,
    });

    return user;
  } catch (error) {
    console.error("Error occurred at getAccountByProvider ", error);
    throw error;
  }
};

export const getAccountByUser = async (userId: string) => {
  try {
    const user = await db.query.accounts.findFirst({
      where: sql`${accounts.provider} = ${"google"} AND ${
        accounts.userId
      } = ${userId}`,
    });

    return user;
  } catch (error) {
    console.error("Error occurred at getAccountByUserAndProvider ", error);
    throw error;
  }
};
