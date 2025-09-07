"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import AuthButtons from "./auth-buttons";

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
  const router = useRouter();

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {children}
        <Button variant={"link"} onClick={() => router.push(pageLink)}>
          {linkText}
        </Button>
        <AuthButtons />
      </CardContent>
    </Card>
  );
}
