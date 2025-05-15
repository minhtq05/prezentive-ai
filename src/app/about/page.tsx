"use client";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="flex flex-col gap-4 items-center justify-center grow">
        <div className="rounded-full bg-slate-800 text-white text-sm flex flex-row items-center justify-cent-1er gap px-4 py-1 shadow-md">
          Start with version 0.1
          <ArrowRight />
        </div>
        <h1 className="text-6xl font-bold">Welcome to LectureAI</h1>
        <p className="text-lg">Your AI-powered educational assistant.</p>
        <div className="flex flex-row gap-4">
          <Button onClick={() => router.push("/dashboard")}>Open App</Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/documentation")}
          >
            Discover More
          </Button>
        </div>
      </div>
    </div>
  );
}
