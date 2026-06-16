"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { fadeDown, easeOut } from "@/lib/motion";

export function BackendOfflineBanner() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeDown}
      transition={{ duration: 0.5, ease: easeOut }}
      className="border-b border-warning/30 bg-warning/10"
    >
      <div className="container-page flex items-center gap-3 py-3 text-sm">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
        </motion.div>
        <p>
          <strong>Demo mode.</strong> Backend is offline — showing sample products. Start API at{" "}
          <code className="rounded bg-elevated px-1.5 py-0.5 text-xs">http://localhost:5241</code>{" "}
          for live data.
        </p>
      </div>
    </motion.div>
  );
}
