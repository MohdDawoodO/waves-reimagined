"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export default function UploadButton({
  className,
  onChange: setValue,
  onError: setError,
  children,
}: {
  className?: string;
  onChange?: Dispatch<SetStateAction<string>>;
  onError?: Dispatch<SetStateAction<string>>;
  children?: React.ReactNode;
}) {
  const setFileStatus = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    for (const file of e.target.files) {
      const fileSize = file.size / (1024 * 1024);

      if (!file.type.includes("image")) {
        setError ? setError(`Please upload an image`) : null;
        return;
      }

      if (fileSize > 1) {
        setError ? setError("Max file size is 1 MB") : null;
        return;
      }

      const imageURL = URL.createObjectURL(file);
      setValue ? setValue(imageURL) : null;
      setError ? setError("") : null;
    }
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
