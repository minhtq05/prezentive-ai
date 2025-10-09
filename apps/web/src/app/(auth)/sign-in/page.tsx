import auth from "@video/auth/server";
import { GalleryVerticalEnd } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";

const SignInPage = async () => {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session) {
    redirect("/home?redirect=register");
  }

  return (
    <div className="bg-[url(/background.png)] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <Link href="/">
          <p className="text-white text-xl font-bold whitespace-nowrap flex gap-2">
            <GalleryVerticalEnd /> Prezentive AI
          </p>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
