"use client";

/* Fires a page_view into the /t funnel on every route change. */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { slTrack } from "@/lib/track";

export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    slTrack("page_view", { path: pathname });
  }, [pathname]);
  return null;
}
