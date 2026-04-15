"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { UnreadMessageBadge } from "./badges/UnreadMessageBadge";

export function NavMain({
  items,
}: {
  items: (
    | {
        name: string;
        url: string;
        icon?: React.ReactElement;
        isActive?: boolean;
        items?: {
          name: string;
          url: string;
          icon?: React.ReactElement;
        }[];
      }
    | {
        name: string;
        url: string;
        icon: React.ReactElement;
      }
  )[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          "items" in item && item.items ? (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.name}>
                    {item.icon && <>{item.icon}</>}
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.name}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            {subItem.icon && <>{subItem.icon}</>}
                            <span>{subItem.name}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href={item.url} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                  {item.name === "Messages" && (
                    <UnreadMessageBadge className="absolute right-0 bottom-3" />
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
