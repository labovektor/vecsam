"use client";

import React from "react";

import { motion } from "framer-motion";
import { Star, Zap, Shield, Users, BarChart, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Secure Testing Environment",
    description:
      "Advanced proctoring and anti-cheating measures to ensure exam integrity.",
    icon: <Shield className="size-5" />,
  },
  {
    title: "Real-time Analytics",
    description:
      "Monitor exam progress and analyze student performance with detailed insights.",
    icon: <BarChart className="size-5" />,
  },
  {
    title: "Question Bank Management",
    description:
      "Create and organize extensive question libraries with multiple question types.",
    icon: <Layers className="size-5" />,
  },
  {
    title: "Automated Grading",
    description:
      "Save time with intelligent auto-grading for various question formats.",
    icon: <Zap className="size-5" />,
  },
  {
    title: "Student Management",
    description:
      "Efficiently manage student enrollment, groups, and exam assignments.",
    icon: <Users className="size-5" />,
  },
  {
    title: "24/7 Support",
    description:
      "Get help whenever you need it with our dedicated education support team.",
    icon: <Star className="size-5" />,
  },
];

const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg">
            Our comprehensive platform provides all the tools you need to
            streamline your workflow, boost productivity, and achieve your
            goals.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={item}>
              <Card className="border-border/40 from-background to-muted/10 h-full overflow-hidden bg-gradient-to-b backdrop-blur transition-all hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="bg-primary/10 dark:bg-primary/20 text-primary mb-4 flex size-10 items-center justify-center rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
