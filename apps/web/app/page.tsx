import { Button } from "@/components/ui/button";
import { LogInIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center w-screen h-[100dvh] top-0 left-0" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="text-3xl font-bold mb-2">Quntem Grid</div>
      <div className="text-xl">Easily manage your ThetaOS devices</div>
      <div className="flex flex-row items-center justify-center gap-4 mt-4">
        <Link href="/setup"><Button variant="outline"><SparklesIcon />Get Started</Button></Link>
        <Link href="/app"><Button variant="outline"><LogInIcon />Login</Button></Link>
      </div>
    </div>
  );
}
