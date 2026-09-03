"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import { cn } from "../lib/utils"
import { NavItem } from "../types/nav"

function renderIcon(icon: React.ReactNode | React.ElementType) {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    return icon;
  }
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null)) {
    const IconComponent = icon as React.ElementType;
    return <IconComponent className="size-4" />;
  }
  return icon;
}

export function NavMain({
  items,
}: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 py-1">
        Menu
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1.5">
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={cn(
                  "rounded-xl transition-all duration-200",
                  item.isActive
                    ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 dark:text-orange-400 font-semibold border-l-3 border-orange-500"
                    : "hover:bg-accent/80"
                )}
              >
                <Link href={item.url}>
                  <div className={cn(
                    "flex size-9 items-center justify-center rounded-lg transition-all duration-200",
                    item.isActive
                      ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-muted/50 text-orange-600 dark:text-orange-400"
                  )}>
                    {renderIcon(item.icon)}
                  </div>
                  <span className="px-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform duration-200 text-muted-foreground/60 hover:text-emerald-500 dark:hover:text-emerald-400">
                      <ChevronRightIcon className="size-4" />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="space-y-1 mt-1 ml-2 border-l border-emerald-100/50 dark:border-emerald-800/30 pl-2">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="rounded-lg transition-all duration-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-300"
                          >
                            <Link href={subItem.url} className="flex items-center gap-2 px-1 py-1.5">
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
