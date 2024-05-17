"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface InventoryLeftMenuOptionsProps {
  className?: string;
  href: string;
  children: React.ReactNode;
}

const InventoryLeftMenuOptions = ({
  href,
  children,
  className,
}: InventoryLeftMenuOptionsProps) => {
  const url = usePathname();

  return (
    <Link
      className={cn(
        "flex gap-2 px-4 py-2.5 text-sm text-white font-semiBold items-center hover:bg-slate-400/35 border-b",
        url === href ? "bg-slate-400/35" : "",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

export default InventoryLeftMenuOptions;
