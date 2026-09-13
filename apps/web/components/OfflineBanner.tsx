"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const on = () => setOffline(!navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", on); };
  }, []);
  return (
    <AnimatePresence>
      {offline && (
        <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs font-medium px-4 py-2 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" /> You’re offline — messages will send when you’re back online
        </motion.div>
      )}
    </AnimatePresence>
  );
}
