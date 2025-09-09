"use client";

import { CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

export default function FormSuccess({ success }: { success: string }) {
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-2 text-green-400">
        <CheckCircle2 className="w-[14px] h-[14px] sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm">{success}</span>
      </AlertTitle>
    </Alert>
  );
}
