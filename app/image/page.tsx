"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";

export default function ImageToolbox() {
  return (
    <main className="w-full min-h-screen bg-[#f8f9fb] relative overflow-hidden font-sans flex flex-col" style={{ background: 'radial-gradient(circle at 0% 0%, #d4e9ff 0%, #ffffff 50%, #fbe7ef 100%)' }}>
      {/* Navigation Bar */}
      <header className="relative z-10 w-full p-6 flex items-center">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-slate-900 border border-white/60"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </motion.button>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 ml-4 tracking-tight">Image Toolbox</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-80 bg-white/40 backdrop-blur-[40px] rounded-[3rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-4"
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2 ring-8 ring-blue-50/50">
              <ImageIcon size={32} strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-slate-800 mb-1">
              Image Toolbox Coming Soon
            </p>
            <p className="text-slate-500 max-w-sm">
              We're building out the image processing tools. Check back later!
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
