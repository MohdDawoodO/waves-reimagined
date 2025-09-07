"use client";

import { useEffect } from "react";

export default function Error({
  reset,
  error,
}: {
  reset: () => void;
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <h1>{error.message}</h1>
      <button onClick={() => reset()} className="cursor-pointer">
        Reset
      </button>
    </div>
  );
}
