"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const HowItWorksSection = () => {
  return (
    <section className="bg-muted/30 relative w-full overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 mx-auto h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)] bg-[size:4rem_4rem] dark:bg-black dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simple Process, Powerful Results
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg">
            Get started in minutes and see the difference our platform can make
            for your business.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3 md:gap-12">
          <div className="via-border absolute top-1/2 right-0 left-0 z-0 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent to-transparent md:block"></div>

          {[
            {
              step: "01",
              title: "Create Your Exam",
              description:
                "Build comprehensive exams using our intuitive question builder and templates.",
            },
            {
              step: "02",
              title: "Invite Students",
              description:
                "Easily enroll students and configure exam settings, timing, and access controls.",
            },
            {
              step: "03",
              title: "Monitor & Grade",
              description:
                "Track exam progress in real-time and leverage automated grading features.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10 flex flex-col items-center space-y-4 text-center"
            >
              <div className="from-primary to-primary/70 text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold shadow-lg">
                {step.step}
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
