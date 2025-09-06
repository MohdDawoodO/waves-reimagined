"use client";

import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FaGithub } from "react-icons/fa";

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {children}
        <Button variant={"link"} onClick={() => router.push(pageLink)}>
          {linkText}
        </Button>
        <div className="flex gap-4">
          <Button size={"icon"} variant={"outline"}>
            <FcGoogle />
          </Button>
          <Button size={"icon"} variant={"outline"}>
            <FaGithub />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
