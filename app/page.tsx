"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Image as ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#f8f9fb] flex items-center justify-center relative overflow-hidden font-sans" style={{ background: 'radial-gradient(circle at 0% 0%, #d4e9ff 0%, #ffffff 50%, #fbe7ef 100%)' }}>
      
      <div className="relative z-10 w-full max-w-[960px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            MediaBox
          </h1>
          <p className="text-lg text-slate-500 mb-16 max-w-md mx-auto font-medium">
            Select a toolkit to begin processing your files.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/pdf" className="flex-1 max-w-[280px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-48 bg-white/40 hover:bg-white/80 transition-all cursor-pointer rounded-[2.5rem] p-6 border border-white/50 shadow-sm flex flex-col items-start text-left group"
              >
                <div className="flex items-start justify-between w-full mb-4">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-[20px] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText size={28} strokeWidth={2} />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors"></div>
                </div>
                <h3 className="font-bold text-slate-800 text-xl">PDF Toolbox</h3>
                <p className="text-sm text-slate-500 mt-1">Merge, Compress, Split, or Convert</p>
              </motion.div>
            </Link>

            <Link href="/image" className="flex-1 max-w-[280px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-48 bg-white/40 hover:bg-white/80 transition-all cursor-pointer rounded-[2.5rem] p-6 border border-white/50 shadow-sm flex flex-col items-start text-left group"
              >
                <div className="flex items-start justify-between w-full mb-4">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-[20px] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ImageIcon size={28} strokeWidth={2} />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors"></div>
                </div>
                <h3 className="font-bold text-slate-800 text-xl">Image Toolbox</h3>
                <p className="text-sm text-slate-500 mt-1">Resize, Optimize, WebP, Crop</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
