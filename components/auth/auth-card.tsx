"use client";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AuthButtons from "./auth-buttons";
import Link from "next/link";

export default function AuthCard({
  title,
  children,
  description,
  pageLink,
  linkText,
  withSocials,
}: {
  title: string;
  children?: React.ReactNode;
  description?: string;
  pageLink?: string;
  linkText?: string;
  withSocials?: boolean;
}) {
  return (
    <Card className="max-w-xl mx-auto py-4 md:py-6">
      <CardHeader className="px-4 md:px-6">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4 md:px-6">
        {children}
        {withSocials || pageLink ? (
          <div className="flex flex-col gap-2">
            {withSocials && <AuthButtons />}
            {pageLink && linkText && (
              <Button variant={"link"} className="w-fit self-center">
                <Link href={pageLink}>{linkText}</Link>
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
