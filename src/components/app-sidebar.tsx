import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, CheckSquare, ChevronDown, LayoutGrid, ListCollapse, LogIn, Menu, MessageSquareWarning, Rows3, Smartphone, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type Demo = {
  slug: string;
  name: string;
  short: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "live" | "soon";
};

export const DEMOS: Demo[] = [
  {
    slug: "device-switcher",
    name: "Device Switcher",
    short: "Devices",
    path: "/",
    icon: Smartphone,
    status: "live",
  },
  {
    slug: "login-screens",
    name: "Login Screens",
    short: "Login",
    path: "/login-screens",
    icon: LogIn,
    status: "live",
  },
  {
    slug: "toasts",
    name: "User Feedback · Toasts",
    short: "Toasts",
    path: "/toasts",
    icon: Bell,
    status: "live",
  },
  {
    slug: "modals",
    name: "Modals",
    short: "Modals",
    path: "/modals",
    icon: MessageSquareWarning,
    status: "live",
  },
  {
    slug: "navigation",
    name: "Navigation · Hamburger & Desktop",
    short: "Navigation",
    path: "/navigation",
    icon: Menu,
    status: "live",
  },
  {
    slug: "dropdowns",
    name: "Dropdowns · Menu, Popover, Sheet",
    short: "Dropdowns",
    path: "/dropdowns",
    icon: ChevronDown,
    status: "live",
  },
  {
    slug: "flex",
    name: "Flexbox Playground",
    short: "Flex",
    path: "/flex",
    icon: Rows3,
    status: "live",
  },
  {
    slug: "grid",
    name: "CSS Grid Playground",
    short: "Grid",
    path: "/grid",
    icon: LayoutGrid,
    status: "live",
  },
  {
    slug: "accordions",
    name: "Accordions",
    short: "Accordions",
    path: "/accordions",
    icon: ListCollapse,
    status: "live",
  },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (r) => r.location.pathname,
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">Modern CSS</span>
            <span className="truncate text-[11px] text-muted-foreground">Live demos</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Demos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DEMOS.map((demo) => {
                const active = currentPath === demo.path;
                return (
                  <SidebarMenuItem key={demo.slug}>
                    <SidebarMenuButton asChild isActive={active} tooltip={demo.name}>
                      <Link to={demo.path} className="flex items-center gap-2">
                        <demo.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{demo.short}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Coming soon</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              More CSS demos will land here.
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="px-2 py-1.5 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          v0.1 · mobile-first
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
