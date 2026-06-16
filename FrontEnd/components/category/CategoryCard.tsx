"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CategoryDto } from "@/types/category";
import { cn } from "@/lib/cn";
import { hoverLift, springTransition, tapScale } from "@/lib/motion";

const COLORS = [
  "from-blue-500/20 to-blue-600/5",
  "from-purple-500/20 to-purple-600/5",
  "from-emerald-500/20 to-emerald-600/5",
  "from-orange-500/20 to-orange-600/5",
  "from-pink-500/20 to-pink-600/5",
  "from-cyan-500/20 to-cyan-600/5",
];

export function CategoryCard({
  category,
  index = 0,
}: {
  category: CategoryDto;
  index?: number;
}) {
  return (
    <motion.div whileHover={hoverLift} whileTap={tapScale} transition={springTransition}>
      <Link
        href={`/categories/${category.Id}`}
        className={cn(
          "group card-interactive flex flex-col items-center justify-center gap-3 p-6 text-center",
          `bg-gradient-to-br ${COLORS[index % COLORS.length]}`,
        )}
      >
        <motion.div
          className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-2xl font-bold text-accent"
          whileHover={{ scale: 1.12, rotate: -6 }}
          transition={springTransition}
        >
          {category.Name.charAt(0)}
        </motion.div>
        <span className="font-semibold transition-colors group-hover:text-accent">
          {category.Name}
        </span>
        <motion.span
          className="text-muted"
          initial={{ opacity: 0, x: -4 }}
          whileHover={{ opacity: 1, x: 4 }}
        >
          <ArrowRight className="h-4 w-4" />
        </motion.span>
      </Link>
    </motion.div>
  );
}
