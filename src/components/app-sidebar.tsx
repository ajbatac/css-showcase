import { Link, useRouterState } from "@tanstack/react-router";
import { Box, LayoutGrid } from "lucide-react";

import { CATEGORY_ORDER, DEMOS } from "@/lib/demos";
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

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (r) => r.location.pathname,
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-0 p-0">
        <div className="flex h-20 items-center gap-4 px-3 group-data-[collapsible=icon]:px-2">
          <img
            src="/logo.png"
            alt="CSS Showcase"
            className="h-16 w-16 shrink-0 rounded-xl object-cover group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
          />
          <div className="flex min-w-0 flex-col gap-1 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-base font-semibold leading-none">CSS Showcase</span>
            <span className="truncate text-xs leading-none text-muted-foreground">Live demos</span>
          </div>
        </div>
        <hr className="border-t border-sidebar-border" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="mt-1">
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={currentPath === "/demos"} tooltip="All demos">
                  <Link to="/demos" className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 shrink-0" />
                    <span className="truncate">All demos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === "/components"}
                  tooltip="Reusable components"
                >
                  <Link to="/components" className="flex items-center gap-2">
                    <Box className="h-4 w-4 shrink-0" />
                    <span className="truncate">Components</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {CATEGORY_ORDER.map((category) => {
          const items = DEMOS.filter((d) => d.category === category);
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={category}>
              <SidebarGroupLabel>{category}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((demo) => {
                    const active = currentPath === demo.path;
                    return (
                      <SidebarMenuItem key={demo.slug}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={`${category} · ${demo.name}`}
                        >
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
          );
        })}

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
