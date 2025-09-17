"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export default function UploadButton({
  className,
  onChange: setValue,
  onDataURI: setDataURI,
  onError: setError,
  children,
}: {
  className?: string;
  onChange?: Dispatch<SetStateAction<string>> | undefined;
  onDataURI?: Dispatch<SetStateAction<string>> | undefined;
  onError?: Dispatch<SetStateAction<string>> | undefined;
  children?: React.ReactNode;
}) {
  const setFileStatus = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    for (const file of e.target.files) {
      const fileSize = file.size / (1024 * 1024);

      if (!file.type.includes("image")) {
        if (setError) setError(`Please upload an image`);
        return;
      }

      if (fileSize > 1) {
        if (setError) setError("Max file size is 1 MB");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener("load", () => {
        if (setValue) setValue(reader.result as string);
      });

      if (setError) setError("");
    }

    e.target.value = null!;
  };

  return (
    <Button className={cn("relative", className)}>
      {children}
      <input
        type="file"
        className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
        onChange={setFileStatus}
      />
    </Button>
  );
}
