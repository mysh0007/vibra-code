"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Octokit } from "@octokit/rest";
import { inngest } from "@/lib/inngest";
import { auth } from "@clerk/nextjs/server";

/**
 * ============================================================
 * Check GitHub connection
 * ============================================================
 *
 * Checks whether the currently authenticated Clerk user
 * has GitHub credentials stored in Convex.
 */
export async function checkGitHubConnection(): Promise<{
  isConnected: boolean;
  username?: string;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        isConnected: false,
        error: "Not authenticated",
      };
    }

    // Get stored GitHub credentials from Convex
    const creds = await fetchQuery(api.github.getByClerkId, {
      clerkId: userId,
    });

    if (!creds?.accessToken) {
      return {
        isConnected: false,
      };
    }

    // Verify GitHub token
    try {
      const octokit = new Octokit({
        auth: creds.accessToken,
      });

      const { data: githubUser } =
        await octokit.rest.users.getAuthenticated();

      return {
        isConnected: true,
        username: githubUser.login,
      };
    } catch (error) {
      console.error(
        "GitHub token validation failed:",
        error
      );

      // Token is invalid/expired
      try {
        await fetchMutation(api.github.remove, {
          clerkId: userId,
        });
      } catch (removeError) {
        console.error(
          "Failed to remove invalid GitHub credentials:",
          removeError
        );
      }

      return {
        isConnected: false,
        error:
          "GitHub token expired or is invalid. Please reconnect GitHub.",
      };
    }
  } catch (error) {
    console.error(
      "GitHub connection check error:",
      error
    );

    return {
      isConnected: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check GitHub connection",
    };
  }
}

/**
 * ============================================================
 * Save GitHub credentials
 * ============================================================
 *
 * IMPORTANT:
 * This function no longer uses NextAuth.
 *
 * The GitHub access token must be supplied by the GitHub
 * OAuth flow and then saved here.
 */
export async function saveGitHubCredentials({
  accessToken,
}: {
  accessToken: string;
}): Promise<{
  success: boolean;
  username?: string;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Not authenticated with Clerk",
      };
    }

    if (!accessToken) {
      return {
        success: false,
        error: "GitHub access token is required",
      };
    }

    // Verify token with GitHub
    const octokit = new Octokit({
      auth: accessToken,
    });

    const { data: githubUser } =
      await octokit.rest.users.getAuthenticated();

    // Save credentials to Convex
    await fetchMutation(api.github.upsert, {
      clerkId: userId,
      accessToken,
      username: githubUser.login,
    });

    return {
      success: true,
      username: githubUser.login,
    };
  } catch (error: any) {
    console.error(
      "Save GitHub credentials error:",
      error
    );

    if (error?.status === 401) {
      return {
        success: false,
        error: "Invalid GitHub access token",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save GitHub credentials",
    };
  }
}

/**
 * ============================================================
 * Disconnect GitHub
 * ============================================================
 */
export async function disconnectGitHub(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    await fetchMutation(api.github.remove, {
      clerkId: userId,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Disconnect GitHub error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to disconnect GitHub",
    };
  }
}

/**
 * ============================================================
 * Create GitHub repository
 * ============================================================
 */
export async function createGitHubRepo({
  repoName,
  isPrivate,
}: {
  repoName: string;
  isPrivate: boolean;
}): Promise<{
  success: boolean;
  repository?: string;
  repositoryUrl?: string;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Get GitHub credentials from Convex
    const creds = await fetchQuery(
      api.github.getByClerkId,
      {
        clerkId: userId,
      }
    );

    if (!creds?.accessToken) {
      return {
        success: false,
        error:
          "GitHub is not connected. Please connect your GitHub account first.",
      };
    }

    // Clean repository name
    const cleanRepoName = repoName
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 100);

    if (!cleanRepoName) {
      return {
        success: false,
        error: "Invalid repository name",
      };
    }

    const octokit = new Octokit({
      auth: creds.accessToken,
    });

    const { data: repo } =
      await octokit.rest.repos.createForAuthenticatedUser(
        {
          name: cleanRepoName,
          private: isPrivate,
          auto_init: false,
          description:
            "Created with VibraCoder - AI Mobile App Builder",
        }
      );

    return {
      success: true,
      repository: repo.full_name,
      repositoryUrl: repo.html_url,
    };
  } catch (error: any) {
    console.error(
      "Create GitHub repository error:",
      error
    );

    if (error?.status === 401) {
      return {
        success: false,
        error:
          "GitHub token expired or is invalid. Please reconnect GitHub.",
      };
    }

    if (error?.status === 403) {
      return {
        success: false,
        error:
          "GitHub denied permission to create repositories. Please check your GitHub permissions.",
      };
    }

    if (error?.status === 422) {
      return {
        success: false,
        error:
          "Repository name already exists or is invalid.",
      };
    }

    return {
      success: false,
      error:
        error?.message ||
        "Failed to create GitHub repository",
    };
  }
}

/**
 * ============================================================
 * Create repository + trigger initial push
 * ============================================================
 */
export async function createAndPushToGitHub({
  sessionId,
  convexId,
  repoName,
  isPrivate,
}: {
  sessionId: string;
  convexId: Id<"sessions">;
  repoName: string;
  isPrivate: boolean;
}): Promise<{
  success: boolean;
  repository?: string;
  repositoryUrl?: string;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Make sure GitHub is connected
    const creds = await fetchQuery(
      api.github.getByClerkId,
      {
        clerkId: userId,
      }
    );

    if (!creds?.accessToken) {
      return {
        success: false,
        error:
          "GitHub is not connected. Please connect your GitHub account.",
      };
    }

    // Update session status
    await fetchMutation(api.sessions.update, {
      id: convexId,
      status: "CREATING_GITHUB_REPO",
      githubPushStatus: "in_progress",
    });

    // Create repository
    const repoResult =
      await createGitHubRepo({
        repoName,
        isPrivate,
      });

    if (
      !repoResult.success ||
      !repoResult.repository
    ) {
      await fetchMutation(api.sessions.update, {
        id: convexId,
        status: "PUSH_FAILED",
        githubPushStatus: "failed",
      });

      return repoResult;
    }

    // Save repository information
    await fetchMutation(api.sessions.update, {
      id: convexId,
      githubRepository:
        repoResult.repository,
      githubRepositoryUrl:
        repoResult.repositoryUrl,
      status: "INITIALIZING_GIT",
    });

    // Trigger Inngest push job
    await inngest.send({
      name: "vibracode/push.github",
      data: {
        sessionId,
        convexId,
        repository:
          repoResult.repository,
        isInitialPush: true,
      },
    });

    return {
      success: true,
      repository:
        repoResult.repository,
      repositoryUrl:
        repoResult.repositoryUrl,
    };
  } catch (error) {
    console.error(
      "Create and push to GitHub error:",
      error
    );

    try {
      await fetchMutation(api.sessions.update, {
        id: convexId,
        status: "PUSH_FAILED",
        githubPushStatus: "failed",
      });
    } catch (updateError) {
      console.error(
        "Failed to update session after GitHub error:",
        updateError
      );
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create repository and push to GitHub",
    };
  }
}

/**
 * ============================================================
 * Generate repository name
 * ============================================================
 */
export async function generateRepoName(
  sessionName: string
): Promise<string> {
  const name = sessionName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);

  return name || "vibra-app";
}

/**
 * ============================================================
 * Retry GitHub push
 * ============================================================
 */
export async function retryGitHubPush({
  sessionId,
  convexId,
  repository,
}: {
  sessionId: string;
  convexId: Id<"sessions">;
  repository: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Verify GitHub connection
    const creds = await fetchQuery(
      api.github.getByClerkId,
      {
        clerkId: userId,
      }
    );

    if (!creds?.accessToken) {
      return {
        success: false,
        error:
          "GitHub is not connected. Please reconnect GitHub.",
      };
    }

    // Update session status
    await fetchMutation(api.sessions.update, {
      id: convexId,
      status: "PUSHING_TO_GITHUB",
      githubPushStatus: "in_progress",
    });

    // Trigger Inngest
    await inngest.send({
      name: "vibracode/push.github",
      data: {
        sessionId,
        convexId,
        repository,
        isInitialPush: false,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Retry GitHub push error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to retry GitHub push",
    };
  }
}

/**
 * ============================================================
 * Clear session GitHub repository
 * ============================================================
 */
export async function clearSessionGitHub({
  convexId,
}: {
  convexId: Id<"sessions">;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    await fetchMutation(api.sessions.update, {
      id: convexId,
      githubRepository: "",
      githubRepositoryUrl: "",
      githubPushStatus: "pending",
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Clear session GitHub error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to clear GitHub repository",
    };
  }
}
