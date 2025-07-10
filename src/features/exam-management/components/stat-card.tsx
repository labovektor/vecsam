import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type ExamStatCardProps = {
  title: string;
  value: any;
  href?: string;
  action?: VoidFunction;
  className?: string;
  icon: React.ReactNode;
};

const ExamStatCard = ({
  title,
  value,
  href,
  action,
  className,
  icon,
}: ExamStatCardProps) => {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-2">
        <div
          className={cn(
            "txt-muted-foreground bg-muted h-fit rounded-full p-4",
            className,
          )}
        >
          {icon}
        </div>
        <div>
          <CardDescription>{title}</CardDescription>
          <span className="text-3xl font-bold">{value}</span>
        </div>
        {href && (
          <div className="ml-auto">
            <Link
              prefetch={true}
              href={href}
              className={buttonVariants({ variant: "default", size: "icon" })}
            >
              <ArrowRight />
            </Link>
          </div>
        )}
        {action && (
          <div className="ml-auto">
            <Button onClick={action} size="icon">
              <ArrowRight />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamStatCard;
