import { PostHog } from "posthog-node";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY as string;
const POSTHOG_HOST = process.env.POSTHOG_HOST;

export const analyticsClient = new PostHog(POSTHOG_API_KEY, {
  host: POSTHOG_HOST,
});
