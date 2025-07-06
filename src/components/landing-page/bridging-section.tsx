"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Building } from "lucide-react";

export function BridgeSection() {
  return (
    <section className="from-muted/30 to-background relative w-full overflow-hidden bg-gradient-to-b py-20 md:py-32">
      <div className="absolute inset-0 -z-10 mx-auto h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)] bg-[size:4rem_4rem] dark:bg-black dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <Badge
            className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            For Everyone
          </Badge>
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
            Designed for Students, Built for Educators
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[800px] md:text-lg">
            Whether you're taking an exam or creating one, VecSys Exam provides
            the tools and security you need for success.
          </p>
        </motion.div>

        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Student Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/40 from-background to-muted/10 h-full overflow-hidden bg-gradient-to-b backdrop-blur">
              <CardContent className="p-8">
                <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <GraduationCap className="size-6" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">For Students</h3>
                <p className="text-muted-foreground mb-6">
                  Take exams with confidence using our secure, user-friendly
                  platform designed with your success in mind.
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span>Easy exam access with secure login</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span>Real-time progress tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span>Instant feedback and results</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-blue-500"></div>
                    <span>Works on any device, anywhere</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Educator Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/40 from-background to-muted/10 h-full overflow-hidden bg-gradient-to-b backdrop-blur">
              <CardContent className="p-8">
                <div className="bg-primary/10 dark:bg-primary/20 text-primary mb-6 flex size-12 items-center justify-center rounded-full">
                  <Building className="size-6" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">For Educators</h3>
                <p className="text-muted-foreground mb-6">
                  Create, manage, and analyze exams with powerful tools that
                  save time and ensure academic integrity.
                </p>
                <ul className="mb-8 space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="bg-primary size-2 rounded-full"></div>
                    <span>Advanced exam builder and question banks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary size-2 rounded-full"></div>
                    <span>Automated grading and analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary size-2 rounded-full"></div>
                    <span>Anti-cheating and proctoring tools</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-primary size-2 rounded-full"></div>
                    <span>Comprehensive student management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-8 text-center md:grid-cols-4"
        >
          {[
            { number: "200+", label: "Active Students" },
            { number: "1", label: "Educators" },
            { number: "0", label: "Exams Completed" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-primary text-3xl font-bold md:text-4xl">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
