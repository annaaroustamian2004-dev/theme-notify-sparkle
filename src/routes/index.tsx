import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PhillyAir — Real-time Air Quality" },
      { name: "description", content: "Real-time air quality and weather monitoring for Philadelphia." },
      { property: "og:title", content: "PhillyAir — Real-time Air Quality" },
      { property: "og:description", content: "Real-time air quality and weather monitoring for Philadelphia." },
    ],
  }),
  component: Dashboard,
});
