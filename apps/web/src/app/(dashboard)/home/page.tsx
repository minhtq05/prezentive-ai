"use client";

import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/projects");
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <h2>Home Page</h2>
      {/* <div className="flex flex-col gap-8 items-center justify-center p-16">
        <p className="text-4xl font-semibold text-center">
          Welcome to Prezentive AI Video Editor. Start creating your masterpiece
          now.
        </p>
        <Button onClick={handleCreateProject}>Start Editing</Button>
        <p className="text-lg font-semibold text-center text-muted-foreground">
          Create stunning, interactive videos with the power of AI. Transform
          your ideas into compelling visual stories.
        </p>
        <video autoPlay muted loop className="w-3/4 rounded-lg">
          <source src="/home-page-video.mp4" type="video/mp4" />
        </video>
      </div> */}
    </div>
  );
};

export default HomePage;
