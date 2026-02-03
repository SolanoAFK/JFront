
"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2,
  MapPin,
  Calendar,
  DollarSign
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
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Project, ProjectStatus } from '@/lib/types';
import apiClient from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/proyectos');
      setProjects(res.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los proyectos.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
    try {
      await apiClient.delete(`/proyectos/${id}`);
      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente.",
      });
      loadProjects();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el proyecto.",
      });
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const variants: Record<ProjectStatus, any> = {
      PLANIFICACION: { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Planificación' },
      EN_PROGRESO: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'En Progreso' },
      COMPLETADO: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Completado' },
      CANCELADO: { color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Cancelado' },
    };
    const { color, label } = variants[status] || { color: 'bg-gray-100', label: status };
    return <Badge variant="outline" className={color}>{label}</Badge>;
  };

  const filteredProjects = projects.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Proyectos</h1>
            <p className="text-muted-foreground">Gestiona todas las obras en curso y finalizadas.</p>
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20" asChild>
            <Link href="/proyectos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre o ubicación..." 
              className="pl-10 h-10 rounded-xl bg-slate-50 border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-10">Filtros</Button>
            <Button variant="outline" className="rounded-xl h-10">Exportar</Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[300px]">Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead className="w-[200px]">% Completado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-10 bg-slate-100 animate-pulse rounded-lg" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-slate-100 animate-pulse rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-32 bg-slate-100 animate-pulse rounded-lg" /></TableCell>
                    <TableCell><div className="h-6 w-full bg-slate-100 animate-pulse rounded-full" /></TableCell>
                    <TableCell><div className="h-8 w-8 ml-auto bg-slate-100 animate-pulse rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredProjects.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{p.nombre}</span>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3" /> {p.ubicacion}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(p.estadoProyecto)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 font-semibold text-sm">
                        <DollarSign className="h-3 w-3 text-emerald-600" />
                        {p.presupuestoRestante.toLocaleString()} / {p.presupuestoTotal.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">
                        Restante / Total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>PROGRESO</span>
                        <span>{p.porcentajeCompletado}%</span>
                      </div>
                      <Progress value={p.porcentajeCompletado} className="h-2 rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem asChild>
                          <Link href={`/proyectos/${p.id}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/proyectos/editar/${p.id}`} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(p.id!)} 
                          className="text-destructive focus:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProjects.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                      <HardHat className="h-12 w-12 opacity-20" />
                      <p>No se encontraron proyectos.</p>
                      <Button variant="link" onClick={() => setSearchTerm('')}>Limpiar búsqueda</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
