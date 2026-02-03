
"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  ShieldCheck,
  Mail,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';
import apiClient from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.rol !== 'ADMIN') {
      toast({
        variant: "destructive",
        title: "Acceso denegado",
        description: "Solo los administradores pueden gestionar usuarios.",
      });
      router.push('/dashboard');
      return;
    }

    async function loadUsers() {
      try {
        const res = await apiClient.get('/usuarios');
        setUsers(res.data);
      } catch (error) {
        console.error("Error loading users", error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [currentUser, router]);

  const getRoleBadge = (role: string) => {
    const roles: Record<string, any> = {
      ADMIN: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Administrador' },
      GERENTE: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Gerente' },
      SUPERVISOR: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Supervisor' },
    };
    const { color, label } = roles[role] || { color: 'bg-slate-100', label: role };
    return <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-full font-bold text-[10px]", color)}>{label}</Badge>;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra el personal y sus permisos de acceso.</p>
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <UserPlus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre, usuario o email..." 
              className="pl-10 h-10 rounded-xl bg-slate-50 border-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 4}).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}><div className="h-14 bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                  </TableRow>
                ))
              ) : users.map((u) => (
                <TableRow key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={`https://picsum.photos/seed/${u.username}/100`} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                          {u.nombre.charAt(0)}{u.apellido.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{u.nombre} {u.apellido}</span>
                        <span className="text-xs text-slate-500 font-medium">@{u.username}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Mail className="h-3.5 w-3.5 opacity-40" />
                      {u.email}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(u.rol)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[10px]">
                      ACTIVO
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
