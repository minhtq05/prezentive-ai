"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      Counter: {count}
      <Button onClick={() => setCount(count + 1)}>increase</Button>
    </div>
  );
}
