import { serve } from "inngest/next";
import { inngest, runAgent, createSession, pushToGitHub, generateVideo, generateImage, stealApp } from "@/lib/inngest";

export const maxDuration = 300;

// Create an API that serves all Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    runAgent,
    createSession,
    pushToGitHub,
    generateVideo,
    generateImage,
    stealApp,
  ],
});
