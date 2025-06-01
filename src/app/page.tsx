"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

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
        <div className="rounded-full bg-primary text-white text-sm flex flex-row items-center justify-center gap-1 px-4 py-1 shadow-md">
          Start with version 0.1
          <ArrowRight className="w-4 h-4" />
        </div>
        <h1 className="text-6xl font-bold">Welcome to LectureAI</h1>
        <p className="text-lg">Your AI-powered educational assistant.</p>
        <div className="flex flex-row gap-4">
          <Button onClick={() => router.push("/dashboard")}>Get Started</Button>
          <Button variant="secondary" onClick={() => router.push("/docs")}>
            Discover More
          </Button>
        </div>
      </div>
    </div>
  );
}
