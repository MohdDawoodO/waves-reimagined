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
  children,
  title,
  description,
  pageLink,
  linkText,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  pageLink: string;
  linkText: string;
}) {
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {children}
        <Button variant={"link"}>
          <Link href={pageLink}>{linkText}</Link>
        </Button>
        <AuthButtons />
      </CardContent>
    </Card>
  );
}
