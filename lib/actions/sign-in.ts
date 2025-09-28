"use server";

import {headers} from "next/headers";
import {auth} from "@/lib/better-auth/auth";
import {inngestClient} from "@/lib/inngest/client";
import {logger} from "@/lib/logger";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    logger.info("signing up user ...");

    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      },
    });

    if (response) {
      await inngestClient.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (err) {
    logger.error(err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Error signing up user",
    };
  }
};

export const signIn = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });

    logger.info(response);

    return { success: true, data: response };
  } catch (err) {
    logger.error(err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Sign in failed",
    };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (err) {
    logger.error(err);

    return {
      success: false,
      message: err instanceof Error ? err.message : "Sign out failed",
    };
  }
};
