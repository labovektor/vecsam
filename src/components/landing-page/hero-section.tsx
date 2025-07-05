"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="w-full overflow-hidden py-20 md:py-32 lg:py-40">
      <div className="relative container mx-auto px-4 md:px-6">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:4rem_4rem] dark:bg-black dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="from-foreground to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
            Take Your Exams Anywhere, Anytime
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Access your exams securely from any device. Experience seamless
            online testing with real-time feedback and instant results. Your
            academic success starts here.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 rounded-full px-8 text-base">
              Join Exam Now
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="text-muted-foreground mt-6 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Check className="text-primary size-4" />
              <span>Secure access</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="text-primary size-4" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="text-primary size-4" />
              <span>Any device</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
