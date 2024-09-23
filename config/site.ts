import { env } from "@/lib/env.server";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "S3 Upload Thing",
  description: "File uploader built with shadcn-ui, s3 and react-dropzone",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://s3uploadthing.com",
  links: { github: "https://github.com/rajeshdavidbabu/s3-upload-thing" },
};
