"use client";

import { useState } from "react";
import { getUnitImageUrl } from "@/lib/images";
import { Package } from "lucide-react";

interface UnitImageProps {
  unit: { size: string; name: string };
  width?: number;
  height?: number;
  className?: string;
}

export default function UnitImage({ unit, width = 400, height = 300, className = "" }: UnitImageProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`w-full bg-gradient-to-br from-[#111] to-[#222] flex items-center justify-center ${className}`}>
        <Package className="w-8 h-8 text-[#6b6560]" />
      </div>
    );
  }

  return (
    <img
      src={getUnitImageUrl(unit, width, height)}
      alt={unit.name}
      className={`w-full object-cover ${className}`}
      loading="lazy"
      onError={() => setImgError(true)}
    />
  );
}
