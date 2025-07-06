"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="from-primary to-primary/80 text-primary-foreground relative w-full overflow-hidden bg-gradient-to-br py-20 md:py-32">
      <div className="absolute inset-0 -z-10 mx-auto bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute -top-24 -left-24 mx-auto h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -right-24 -bottom-24 mx-auto h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Ready to Transform Your Assessment Process?
          </h2>
          <p className="text-primary-foreground/80 mx-auto max-w-[700px] md:text-xl">
            Join to streamlined your exam process and improved student outcomes
            with our comprehensive exam platform.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="mailto:labovektor@gmail.com"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Kick Start Now
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
          <p className="text-primary-foreground/80 mt-4 text-sm">
            Talk to us about your requirements.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
