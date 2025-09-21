"use client";
import Hero from "@components/Hero";
import { Separator } from "@/components/ui/separator";
import { Button } from "@components/ui/button";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import SolanaLaunchpadCTA from "@/components/SolanaLaunchpadCTA";
import Partners from "@/components/Partners";
import Services from "@/components/Services";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SolanaLaunchpadCTA />
      <Hero />

      {/* First Video Section (NT.webm + NT.mp4 fallback) */}
      <section className="flex justify-center py-8 px-4">
        <video
          className="w-full max-w-4xl mx-auto rounded-lg shadow-lg border border-teal-500 object-contain"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/poster1.jpg" // optional thumbnail
        >
          <source src="/NT.webm" type="video/webm" />
          <source src="/NT.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Intro Section with NT1.webm + NT1.mp4 fallback */}
      <section className="flex flex-col lg:flex-row justify-center bg-gradient-to-b from-slate-900 to-background items-start gap-8 px-[2em] lg:px-[4em] py-10 w-full">
        <div className="relative flex flex-col h-full gap-4 lg:w-1/2">
          <h1 className="text-[2em] font-bold text-teal-500">
            What is Navitender?
          </h1>
          <video
            className="w-full rounded-lg shadow-lg border border-teal-500 object-contain"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/poster2.jpg" // optional thumbnail
          >
            <source src="/NT1.webm" type="video/webm" />
            <source src="/NT1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex flex-col items-start gap-6 lg:w-1/2 lg:mt-[2em]">
          <p className="pl-2 text-justify text-slate-200 text-lg leading-relaxed">
            Navitender is a Solana-based launchpad that makes it simple to
            create, launch, and grow your token. Whether you’re starting a
            community project or building the next big idea, Navitender gives
            you the tools to succeed.
          </p>
        </div>
      </section>

      <Separator className="w-[90%] mx-auto my-10 lg:my-20" />

      {/* Features Section */}
      <section className="flex flex-col items-center text-slate-200 px-[2em] lg:px-[4em] py-10">
        <h2 className="text-[1.8em] font-bold mb-6 text-teal-400 glitch-text">
          Features
        </h2>
        <ul className="space-y-6 max-w-3xl w-full">
          <li className="border-l-4 border-teal-500 pl-4">
            <span className="font-bold text-teal-300">Simple Token Creation</span> → 
            Launch tokens in minutes without coding.
          </li>
          <li className="border-l-4 border-teal-500 pl-4">
            <span className="font-bold text-teal-300">Liquidity Management</span> → 
            Connect directly with Raydium pools.
          </li>
          <li className="border-l-4 border-teal-500 pl-4">
            <span className="font-bold text-teal-300">Growth Tools</span> → 
            Community-focused features to boost adoption.
          </li>
          <li className="border-l-4 border-teal-500 pl-4">
            <span className="font-bold text-teal-300">Security First</span> → 
            Built with trust and transparency in mind.
          </li>
        </ul>
      </section>

      <Separator className="w-[90%] mx-auto my-10 lg:my-20" />

      {/* Services section */}
      <Services />
      <Separator className="w-[90%] mx-auto my-10 lg:my-20" />

      {/* FAQ section */}
      <FAQ />
      <Separator className="w-[90%] mx-auto my-10 lg:my-20" />

      {/* Partners section */}
      <Partners />

      <Footer />
    </motion.main>
  );
}

