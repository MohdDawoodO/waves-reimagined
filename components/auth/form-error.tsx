"use client";

import { Alert, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function FormError({ error }: { error: string }) {
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-2 text-destructive">
        <AlertCircle size={16} />
        <span>{error}</span>
      </AlertTitle>
    </Alert>
  );
}
