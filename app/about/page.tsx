/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const page = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 about-us lg:py-16"
    >
      <div className="px-[3em] lg:px-[5em] flex flex-col">
        <h2 className="mb-8 text-3xl font-extrabold text-teal-400 font-monsterr lg:text-4xl">
          About Navitender
        </h2>

        <p className="mb-8 text-base leading-6 text-justify text-slate-300 font-rubik lg:text-lg">
          Navitender is a Solana-powered platform built to simplify token
          creation and liquidity management. Whether you're an experienced
          developer or launching your first idea, we give you the tools to bring
          your token to life quickly, safely, and affordably.
        </p>

        <p className="mb-8 text-base leading-6 text-justify text-slate-300 font-rubik lg:text-lg">
          Our mission is to make token launches accessible to everyone — from
          small communities and creators to large-scale projects — by combining
          easy-to-use tools with the power of decentralized finance.
        </p>

        <ul className="mb-8 text-base leading-6 list-disc list-inside text-slate-300 font-rubik lg:text-lg">
          <li>Launch your own Solana token in just a few clicks</li>
          <li>Create and manage liquidity pools directly via Raydium</li>
          <li>Seamless wallet integrations for fast deployment</li>
          <li>Transparent, secure, and user-friendly design</li>
        </ul>

        <p className="text-base leading-6 text-justify text-slate-300 font-rubik lg:text-lg">
          At Navitender, we believe that the future of digital assets should be
          open to everyone. That’s why we’re focused on building tools that
          empower creators, strengthen communities, and make launching on Solana
          as simple as possible.  
        </p>

        <Separator className="mt-8" />
      </div>
    </motion.div>
  );
};

export default page;
