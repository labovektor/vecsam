import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

type ExamStatCardProps = {
  title: string;
  value: any;
  href?: string;
  className?: string;
};

const ExamStatCard = ({ title, value, href, className }: ExamStatCardProps) => {
  return (
    <Card className=" shadow-none">
      <CardContent className=" flex items-center gap-2">
        <div
          className={cn(
            " rounded-full txt-muted-foreground bg-muted p-4 h-fit",
            className
          )}
        >
          <Users />
        </div>
        <div>
          <CardDescription>{title}</CardDescription>
          <span className=" text-3xl font-bold">{value}</span>
        </div>
        {href && (
          <div className=" ml-auto">
            <Link
              href={href}
              className={buttonVariants({ variant: "default", size: "icon" })}
            >
              <ArrowRight />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamStatCard;
