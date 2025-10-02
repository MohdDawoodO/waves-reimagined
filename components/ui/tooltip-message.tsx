"use client";

import { MouseEventHandler } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

export function TooltipMessage({
  message,
  children,
  onClick,
}: {
  message?: string;
  children?: React.ReactNode;
  onClick?: MouseEventHandler;
}) {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger asChild onClick={onClick}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        className="bg-primary"
        arrowClassname="bg-primary fill-primary"
      >
        {message}
      </TooltipContent>
    </Tooltip>
  );
}
