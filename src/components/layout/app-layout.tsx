
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  HardHat, 
  Layers, 
  Users, 
  ReceiptIndianRupee, 
  Contact2, 
  LogOut,
  ChevronRight,
  Menu,
  Bell,
  Settings,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Proyectos', icon: HardHat, path: '/proyectos' },
  { name: 'Fases', icon: Layers, path: '/fases' },
  { name: 'Gastos', icon: ReceiptIndianRupee, path: '/gastos' },
  { name: 'Proveedores', icon: Contact2, path: '/proveedores' },
  { name: 'Usuarios', icon: Users, path: '/usuarios', adminOnly: true },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="border-r border-border shadow-sm">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HardHat className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary font-headline">BuildFlow</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="px-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.adminOnly && user?.rol !== 'ADMIN') return null;
                const isActive = pathname.startsWith(item.path);
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.path} className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-2 hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.username}/200`} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-semibold truncate w-full">{user?.nombre} {user?.apellido}</span>
                    <span className="text-xs text-muted-foreground">{user?.rol}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar proyectos..." 
                  className="pl-10 w-[300px] bg-muted/50 border-none h-9 focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
              <div className="h-8 w-px bg-border mx-2" />
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium leading-none">{user?.nombre}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background/50">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
