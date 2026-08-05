"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { HeroEffects } from "@/components/motion/HeroEffects";
import { MotionButton } from "@/components/motion/MotionButton";
import { easeOut, slideRight, staggerContainer, staggerItem } from "@/lib/motion";

function HeroWave() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 hidden translate-y-px lg:block">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 80 C360 120 720 0 1080 40 C1260 60 1380 80 1440 70 L1440 120 L0 120 Z"
          fill="var(--hero-wave)"
        />
      </svg>
    </div>
  );
}

export function HeroSection() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#2d7ff9] via-[#5b4cf0] to-[#7c3aed] px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:pb-32 lg:pt-20"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <HeroEffects mouse={mouse} />

      <div className="relative z-10 mx-auto w-full max-w-7xl lg:px-2">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl lg:max-w-none"
          >
            <motion.span
              variants={staggerItem}
              className="mb-5 inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:mb-6 sm:text-sm"
            >
              <span className="lg:hidden">Pakistan&apos;s #1 Marketplace</span>
              <span className="hidden lg:inline">E-Commerce Reimagined</span>
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="text-[2rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
            >
              Shop Smart.
              <br />
              Sell Easy.
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:mt-5 sm:text-base lg:text-lg"
            >
              <span className="lg:hidden">
                Experience the next generation of commerce. Premium brands and local
                favorites delivered to your door.
              </span>
              <span className="hidden lg:inline">
                Pakistan&apos;s leading ecosystem for digital commerce. Discover millions
                of products or start your own business journey today.
              </span>
            </motion.p>

            <motion.div variants={staggerItem} className="mt-8 flex flex-col gap-3 lg:hidden">
              <MotionButton href="/products" variant="white" className="h-[52px] w-full rounded-full">
                Shop Now
              </MotionButton>
              <MotionButton
                href="/dashboard/become-seller"
                variant="white"
                className="h-[52px] w-full rounded-full"
              >
                Become a Seller
              </MotionButton>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-8 hidden flex-wrap gap-4 lg:flex">
              <MotionButton href="/products" variant="primary" className="!bg-black !text-white">
                Shop Marketplace
              </MotionButton>
              <MotionButton href="/dashboard/become-seller" variant="secondary">
                Become a Seller
              </MotionButton>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideRight}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
            className="relative mx-auto hidden w-full max-w-lg lg:block lg:max-w-none lg:justify-self-end"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rotate-[3deg] overflow-hidden rounded-2xl shadow-hero ring-1 ring-white/20"
            >
              <Image
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=600&fit=crop"
                alt="Laptop showcasing digital commerce"
                width={900}
                height={600}
                className="h-auto w-full object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <HeroWave />
    </section>
  );
}
