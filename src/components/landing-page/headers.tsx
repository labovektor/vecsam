"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

const Headers = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <Image src="/vecsys.svg" alt="logo" width={120} height={120} />
        </div>
        <nav className="hidden gap-8 md:flex">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#trusted-by"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Trusted By
          </Link>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="#" className={buttonVariants({ variant: "ghost" })}>
            Masuk Sebagai Pengelola <ChevronRight />
          </Link>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-background/95 absolute inset-x-0 top-16 border-b backdrop-blur-lg md:hidden"
        >
          <div className="container flex flex-col gap-4 py-4">
            <Link
              href="#features"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#trusted-by"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              TrustedBy
            </Link>

            <div className="flex flex-col gap-2 border-t pt-2">
              <Link
                href="#"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk Sebagai Pengelola
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Headers;
