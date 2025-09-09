"use client";

import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function FormError({ error }: { error: string }) {
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-[14px] h-[14px] sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm">{error}</span>
      </AlertTitle>
    </Alert>
  );
}
