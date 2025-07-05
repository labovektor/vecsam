import Image from "next/image";
import React from "react";

const LogosSection = () => {
  return (
    <section id="trusted-by" className="bg-muted/30 w-full border-y py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <Image
                key={i}
                src={`/placeholder-logo.svg`}
                alt={`Company logo ${i}`}
                width={120}
                height={60}
                className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogosSection;
