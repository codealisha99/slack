"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Video, Shield, Zap, Users, Hash, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeIn, slideUp } from "@/lib/motion";

export default function MarketingLanding() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <motion.header {...fadeIn} className="h-[64px] border-b border-zinc-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 z-20">
        <div className="flex items-center gap-3">
          <Image src="/slack-logo.png" alt="Slacki" width={32} height={32} className="w-8 h-8 rounded-lg border border-zinc-200" />
          <span className="text-[17px] font-bold tracking-tight">Slacki</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-3 pl-3 border-l border-zinc-200 text-xs font-medium text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="text-sm font-medium text-zinc-700 hover:text-zinc-900 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">Sign in</Link>
          <Link href="/sign-up" className="text-sm font-semibold bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-all shadow-sm hover:shadow hover:-translate-y-px">Get started</Link>
        </div>
      </motion.header>

      <section className="flex-1 grid lg:grid-cols-[1.05fr_0.95fr] gap-0">
        <div className="px-6 lg:px-12 xl:px-16 py-12 lg:py-16 flex flex-col justify-center">
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-[560px]">
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 text-xs font-medium bg-zinc-900 text-white px-3 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" /> New — Video calls & threads now available
            </motion.div>
            <motion.h1 variants={staggerItem} className="text-[40px] lg:text-[52px] font-extrabold tracking-[-0.04em] leading-[0.9] text-zinc-900">
              Where work<br /><span className="text-zinc-500">happens</span><span className="text-zinc-900">.</span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-[17px] leading-7 text-zinc-600 mt-5 max-w-[480px]">
              The professional workspace for teams. Real-time messaging, organized channels, and crystal-clear video — without the noise.
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mt-8">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-px">
                Create workspace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/sign-in" className="inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-semibold px-6 py-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors">
                Sign in
              </Link>
            </motion.div>

            <motion.div variants={staggerItem} className="flex items-center gap-6 mt-8 pt-8 border-t border-zinc-100">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white">A</div>
                <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white">B</div>
                <div className="w-8 h-8 rounded-full bg-zinc-500 border-2 border-white flex items-center justify-center text-[11px] font-bold text-white">C</div>
                <div className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[11px] font-semibold text-zinc-600 shadow-sm">+2k</div>
              </div>
              <p className="text-sm text-zinc-600">Trusted by 2,000+ teams · <span className="font-medium text-zinc-900">4.9/5</span> rating</p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              {[
                { icon: MessageSquare, title: "Real-time chat", desc: "Threads, mentions, and search" },
                { icon: Video, title: "Video & huddles", desc: "One-click calls in channel" },
                { icon: Shield, title: "Secure by default", desc: "Enterprise-grade privacy" },
              ].map((f) => (
                <motion.div key={f.title} variants={staggerItem} whileHover={{ y: -2 }} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 hover:bg-white hover:shadow-sm transition-all">
                  <f.icon className="w-4 h-4 text-zinc-900 mb-2" />
                  <div className="text-sm font-semibold text-zinc-900">{f.title}</div>
                  <div className="text-xs text-zinc-600 leading-relaxed mt-1">{f.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={slideUp} className="mt-8 flex items-center gap-4 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> SOC 2</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> GDPR</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span>99.99% uptime</span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 flex items-center justify-center p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_30%_10%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(800px_400px_at_80%_80%,rgba(255,255,255,0.04),transparent_60%)]" />
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-[560px] rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="h-9 flex items-center gap-1.5 px-4 border-b border-white/10 bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-white/15" /><span className="w-3 h-3 rounded-full bg-white/15" /><span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="ml-3 text-xs text-white/60">slacki — #product · 12 members</span>
              <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium bg-emerald-500 text-white px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live</span>
            </div>
            <Image src="/auth-i.png" alt="Collaboration preview" width={560} height={400} className="w-full h-auto block" priority />
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/70"><Hash className="w-3.5 h-3.5" /> #design · <Users className="w-3.5 h-3.5" /> 8 online</div>
              <span className="text-xs font-medium text-white bg-white/10 px-2.5 py-1 rounded-full">3 new</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-200 px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <span>© {new Date().getFullYear()} Slacki. Crafted for professional teams.</span>
        <span>Privacy · Terms · Security</span>
      </footer>
    </div>
  );
}
