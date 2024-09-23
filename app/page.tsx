import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
      <section
        className="flex flex-col items-center justify-center leading-6 mt-[3rem]"
        aria-label="Nextjs Starter Kit Hero"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.020em] text-center leading-[0.9] text-colored">
          <span className="font-extrabold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient px-2">
            S3 File Uploads
          </span>{" "}
          <br />
          Made Super Simple
          <br />
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-500 text-center mt-2 dark:text-gray-400">
          An open source file uploader that allows you to upload files to S3
          with ease. Built with shadcn-ui, s3 and react-dropzone.
        </p>
        <div className="flex justify-center items-center gap-3">
          <Link href="/dashboard" className="mt-5">
            <Button className="animate-buttonheartbeat rounded-md bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white">
              {user ? "Dashboard" : "Get Started"}
            </Button>
          </Link>

          {/* <Link
            href="https://discord.gg/HUcHdrrDgY"
            target="_blank"
            className="mt-5"
            aria-label="Join Discord (opens in a new tab)"
          >
            <Button variant="outline" className="flex gap-1">
              Join Discord
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link> */}
          <Link
            href="https://github.com/rajeshdavidbabu/s3-upload-thing"
            target="_blank"
            className="animate-buttonheartbeat border p-2 rounded-full mt-5 hover:dark:bg-black hover:cursor-pointer"
            aria-label="View NextJS 14 Starter Template on GitHub"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
