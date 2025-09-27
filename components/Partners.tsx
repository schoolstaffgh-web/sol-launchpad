"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const partnerLogos = ["/im1.webp", "/im2.webp", "/im3.webp", "/im4.webp"];

const Partners = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-slate-900">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <h2 className="mb-12 text-2xl font-bold text-center text-teal-400 glitch-text sm:text-3xl">
          Our Partners
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {partnerLogos.map((logo, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="overflow-hidden h-40 flex items-center justify-center 
                           transition-all duration-300 border border-slate-700 
                           hover:border-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.6)]"
              >
                <CardContent className="flex items-center justify-center w-full h-full p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-center w-full h-full"
                  >
                    <Image
                      src={logo}
                      alt={`Partner ${index + 1}`}
                      width={200}
                      height={100}
                      className="object-contain max-h-full grayscale hover:grayscale-0 transition duration-300"
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
