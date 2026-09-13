import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Slacki — Where Work Happens",
    short_name: "Slacki",
    description: "Professional workspace for teams — real-time messaging and video",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#350d36",
    icons: [
      { src: "/slack-logo.png", sizes: "192x192", type: "image/png" },
      { src: "/slack-logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
