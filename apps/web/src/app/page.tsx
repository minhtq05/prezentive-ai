import { Button } from "@/components/ui/button";
import {
  FileText,
  GalleryVerticalEnd,
  Image,
  Mic,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="h-screen w-screen bg-[url('/background.png')] bg-cover bg-center text-white flex justify-center overflow-auto light">
      <div className="max-w-320 p-4">
        <header className="w-full grid grid-flow-col grid-cols-[1fr_max-content_1fr]">
          {/* Header */}
          <p className="text-xl font-bold whitespace-nowrap flex gap-2">
            <GalleryVerticalEnd /> Prezentive AI
          </p>
          <div className="w-full flex items-center gap-4">
            <Button variant="link" className="text-white">
              Features
            </Button>
            <Button variant="link" className="text-white">
              About
            </Button>
          </div>
          <div className="flex gap-4 justify-end">
            <Link href="home">
              <Button className="rounded-full">Log in</Button>
            </Link>
            <Link href="register">
              <Button className="rounded-full">Get Started Today</Button>
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center pt-32 gap-8">
          {/* Version */}
          <p className="text-md rounded-full shadow-md bg-primary py-2 px-4">
            Version 0.1.0
          </p>
          {/* Main Content */}
          <div className="text-6xl font-medium text-center max-w-[75%]">
            Streamlined Video Production with Generative AI
          </div>
          <div className="text-lg text-center max-w-180">
            Transform your ideas into stunning videos using advanced AI. Edit
            slides, generate narratives, create voices, and produce images—all
            powered by cutting-edge language models.
          </div>
          <div className="space-x-4">
            <Button className="rounded-full">Request Demo</Button>
            <Button className="rounded-full">Get Started for Free</Button>
          </div>
        </div>
        <div className="flex flex-col items-center pt-32 gap-8">
          <p className="text-md rounded-full border-1 border-primary-foreground/50 py-2 px-4">
            Powerful AI Features
          </p>
          <div className="text-lg text-center text-primary-foreground/80 max-w-180">
            Everything you need to create professional videos with the power of
            artificial intelligence
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            {/* AI Slide Editing */}
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Zap />
              <p className="text-md">AI Slide Editing</p>
              <p className="text-sm">
                Edit slides and scenes using advanced language models. Transform
                your content with intelligent suggestions and automated
                improvements.
              </p>
            </div>
            {/* AI Voice Generation */}
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Mic />
              <p className="text-md">AI Voice Generation</p>
              <p className="text-sm">
                Generate natural-sounding voiceovers with AI. Choose from
                multiple voices and languages to bring your presentations to
                life.
              </p>
            </div>
            {/* Narrative Generation */}
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <FileText />
              <p className="text-md">Narrative Generation</p>
              <p className="text-sm">
                Create compelling narratives and scripts automatically. Let AI
                craft engaging stories that captivate your audience.
              </p>
            </div>
            {/* Image Generation */}
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Image />
              <p className="text-md">Image Generation</p>
              <p className="text-sm">
                Generate stunning visuals and graphics with AI. Create custom
                images that perfectly match your presentation&apos;s theme and
                style.
              </p>
            </div>
            {/* Smart Video Editing */}
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Play />
              <p className="text-md">Smart Video Editing</p>
              <p className="text-sm">
                Intelligent video editing powered by AI. Automatically cut,
                arrange, and optimize your content for maximum impact.
              </p>
            </div>
            {/* AI Enhancement */}
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Sparkles />
              <p className="text-md">AI Enhancement</p>
              <p className="text-sm">
                Enhance every aspect of your video with AI. From color
                correction to audio optimization, let AI perfect your creation.
              </p>
            </div>
          </div>
        </div>
        <div className="pt-16">
          <div className="flex flex-col items-center gap-8 w-full rounded-md bg-primary/10 p-16">
            <p className="text-4xl font-semibold">
              Ready to Transform Your Video Creation?
            </p>
            <p>
              Join thousands of creators who are already using AI to produce
              stunning videos effortlessly.
            </p>
            <div className="space-x-4">
              <Button className="rounded-full">Get Started Now</Button>
              <Button className="rounded-full">Request Demo</Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center pt-32">
          <div className="grid grid-cols-5 gap-8">
            <p className="text-center">Docs</p>
            <p className="text-center">Help</p>
            <p className="text-center">Privacy Policy</p>
            <p className="text-center">Terms</p>
            <p className="text-center">About Us</p>
          </div>
        </div>
        <div className="w-full flex justify-between py-16 text-white">
          <p>© 2025 Prezentive AI. All rights reserved.</p>
          <p>Powered by advanced AI technology.</p>
        </div>
      </div>
    </div>
  );
}
