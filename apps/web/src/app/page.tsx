import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const FeatureCard = ({
  title,
  description,
  bgColor,
}: {
  title: string;
  description: string;
  bgColor: string;
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-md p-8`}>
      <p className={`text-2xl font-semibold font-eb-garamond`}>{title}</p>
      <p className="text-sm text-center text-black/50 max-w-3/4">
        {description}
      </p>
    </div>
  );
};

// TODO: fix login.

export default function LandingPage() {
  return (
    // <div className="h-screen w-screen bg-[url('/background.png')] bg-cover bg-center text-white flex justify-center overflow-auto light">
    <div
      className={`h-screen w-screen bg-white bg-cover bg-center text-black flex justify-center overflow-auto light`}
    >
      <div className="max-w-320 p-6">
        <header className="w-full grid grid-flow-col grid-cols-[1fr_max-content_1fr]">
          {/* Header */}
          <p className="text-lg font-bold whitespace-nowrap flex gap-2">
            Prezentive
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
              <Button variant="link">Log in</Button>
            </Link>
            <Link href="register">
              <Button className="rounded-full">Get Started Today</Button>
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center pt-32 gap-8">
          {/* Version */}
          <Link
            href="/home"
            className="text-sm rounded-full bg-black/5 py-2 px-4 flex items-center gap-2"
          >
            <div className="rounded-full shadow-md h-2 aspect-square bg-black" />
            Version 0.1.0
            <ChevronRight className="size-4 text-black/50" />
          </Link>
          {/* Main Content */}
          <div
            className={`text-7xl font-medium text-center max-w-[75%] font-eb-garamond`}
          >
            Turn ideas to contents in seconds
          </div>
          <div className="text-lg text-center max-w-180 px-10">
            Never let your ideas go to waste. Create stunning videos
            effortlessly with the help of generative AI.
          </div>
          <div className="space-x-4">
            <Button className="rounded-full">Try Prezentive Free</Button>
          </div>
        </div>
        <div className="flex flex-col items-center pt-16 gap-8 p-6">
          <p className={`text-3xl font-eb-garamond`}>
            Sketch your worlds with ease
          </p>
          <div className="w-full flex flex-col lg:grid lg:grid-cols-3 gap-4">
            <FeatureCard
              title="Visuals"
              description="Power your perspectives with stunning galleries"
              bgColor="bg-light-purple"
            />
            <FeatureCard
              title="Narratives"
              description="Craft compelling stories with creative agents"
              bgColor="bg-sky-blue"
            />
            <FeatureCard
              title="Sounds"
              description="Bring your stories to life with natural-sounding voices"
              bgColor="bg-celadon"
            />
            {/* <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Zap />
              <p className="text-md">AI Slide Editing</p>
              <p className="text-sm">
                Edit slides and scenes using advanced language models. Transform
                your content with intelligent suggestions and automated
                improvements.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Mic />
              <p className="text-md">AI Voice Generation</p>
              <p className="text-sm">
                Generate natural-sounding voiceovers with AI. Choose from
                multiple voices and languages to bring your presentations to
                life.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <FileText />
              <p className="text-md">Narrative Generation</p>
              <p className="text-sm">
                Create compelling narratives and scripts automatically. Let AI
                craft engaging stories that captivate your audience.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Image />
              <p className="text-md">Image Generation</p>
              <p className="text-sm">
                Generate stunning visuals and graphics with AI. Create custom
                images that perfectly match your presentation&apos;s theme and
                style.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Play />
              <p className="text-md">Smart Video Editing</p>
              <p className="text-sm">
                Intelligent video editing powered by AI. Automatically cut,
                arrange, and optimize your content for maximum impact.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-primary-foreground/5 p-8">
              <Sparkles />
              <p className="text-md">AI Enhancement</p>
              <p className="text-sm">
                Enhance every aspect of your video with AI. From color
                correction to audio optimization, let AI perfect your creation.
              </p>
            </div> */}
          </div>
        </div>
        {/* <div className="pt-16">
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
        </div> */}
        {/* <div className="flex flex-col items-center pt-32">
          <div className="grid grid-cols-5 gap-8">
            <p className="text-center">Docs</p>
            <p className="text-center">Help</p>
            <p className="text-center">Privacy Policy</p>
            <p className="text-center">Terms</p>
            <p className="text-center">About Us</p>
          </div>
        </div> */}
        {/* <div className="w-full flex justify-between py-16 text-white">
          <p>© 2025 Prezentive AI. All rights reserved.</p>
          <p>Powered by advanced AI technology.</p>
        </div> */}
        <div className="w-full h-40 flex flex-col items-center justify-center">
          <p className={`text-2xl font-eb-garamond`}>To be continued...</p>
        </div>
      </div>
    </div>
  );
}
