"use client";

import { LucideProps } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { useRouter } from "next/navigation";
import UserImage from "./user-image";

export default function SidebarGroupContainer({
  title,
  data,
}: {
  title: string;
  data: {
    name: string;
    path: string;
    image?: string | null | undefined;
    icon?:
      | ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
        >
      | undefined
      | null;
  }[];
}) {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                className="text-sm py-5"
                onClick={() => router.push(item.path)}
              >
                {item.icon && <item.icon className="scale-105 mr-2" />}
                {!item.icon && (
                  <UserImage
                    name={item.name}
                    image={item.image}
                    className="scale-90 mr-2"
                  />
                )}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
