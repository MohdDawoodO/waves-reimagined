"use client";

import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function FormError({ error }: { error: string }) {
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-4 h-4 flex-1" />
        <span className="text-sm flex-20">{error}</span>
      </AlertTitle>
    </Alert>
  );
}
