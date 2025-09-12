"use client";

import { CheckCircle2 } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

export default function FormSuccess({ success }: { success: string }) {
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-2 text-green-400">
        <CheckCircle2 className="w-4 h-4 flex-1" />
        <span className="text-sm flex-20">{success}</span>
      </AlertTitle>
    </Alert>
  );
}
