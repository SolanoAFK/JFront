
"use client";

import React, { useEffect, useState } from 'react';
import { 
  HardHat, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  DollarSign, 
  AlertTriangle,
  Building2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Project } from '@/lib/types';
import apiClient from '@/lib/api-client';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiClient.get('/proyectos');
        setProjects(res.data);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.estadoProyecto === 'EN_PROGRESO').length,
    completed: projects.filter(p => p.estadoProyecto === 'COMPLETADO').length,
    totalBudget: projects.reduce((acc, p) => acc + p.presupuestoTotal, 0),
    usedBudget: projects.reduce((acc, p) => acc + (p.presupuestoTotal - p.presupuestoRestante), 0),
  };

  const budgetData = projects.slice(0, 5).map(p => ({
    name: p.nombre.length > 15 ? p.nombre.substring(0, 15) + '...' : p.nombre,
    total: p.presupuestoTotal,
    restante: p.presupuestoRestante,
    gastado: p.presupuestoTotal - p.presupuestoRestante
  }));

  const expenseTypeData = [
    { name: 'Materiales', value: 45, color: '#3b82f6' },
    { name: 'Mano de Obra', value: 30, color: '#10b981' },
    { name: 'Equipos', value: 15, color: '#f59e0b' },
    { name: 'Otros', value: 10, color: '#6366f1' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ef4444'];

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Resumen General</h1>
            <p className="text-muted-foreground">Estado actual de tus proyectos de construcción.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/proyectos">
                Ver Todos los Proyectos
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Proyectos Activos" 
            value={stats.active} 
            icon={TrendingUp} 
            trend="+2 este mes"
            color="text-blue-600 bg-blue-100"
          />
          <StatCard 
            title="Obras Completadas" 
            value={stats.completed} 
            icon={CheckCircle2} 
            trend="100% de éxito"
            color="text-emerald-600 bg-emerald-100"
          />
          <StatCard 
            title="Presupuesto en Uso" 
            value={`$${(stats.usedBudget / 1000000).toFixed(1)}M`} 
            icon={DollarSign} 
            trend="De $24.5M totales"
            color="text-amber-600 bg-amber-100"
          />
          <StatCard 
            title="Tiempo Promedio" 
            value="14.2m" 
            icon={Clock} 
            trend="Por fase"
            color="text-purple-600 bg-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts */}
          <Card className="lg:col-span-2 border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Presupuesto por Proyecto
              </CardTitle>
              <CardDescription>Visualización de presupuesto total vs. gastado</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="gastado" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Gastado" />
                  <Bar dataKey="restante" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Restante" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-500" />
                Distribución de Gastos
              </CardTitle>
              <CardDescription>Categorías de gastos más comunes</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                {expenseTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Proyectos Recientes</CardTitle>
                <CardDescription>Últimas obras registradas en el sistema</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/proyectos">Ver todo</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Building2 className="h-5 w-5 text-slate-500 group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{p.nombre}</p>
                        <p className="text-xs text-muted-foreground">{p.ubicacion}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={p.estadoProyecto === 'EN_PROGRESO' ? 'default' : 'secondary'} className="text-[10px] h-5">
                        {p.estadoProyecto}
                      </Badge>
                      <div className="w-24">
                        <Progress value={p.porcentajeCompletado} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    No hay proyectos registrados aún.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alertas y Avisos
              </CardTitle>
              <CardDescription>Eventos que requieren tu atención inmediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AlertItem 
                  type="critical" 
                  title="Presupuesto Crítico: Torre Titanium" 
                  description="Queda menos del 8% del presupuesto total asignado."
                />
                <AlertItem 
                  type="warning" 
                  title="Próximo a Vencer: Fase Cimentación" 
                  description="La fase de cimentación en Edificio Norte vence en 3 días."
                />
                <AlertItem 
                  type="info" 
                  title="Subfase Pendiente" 
                  description="Hay 5 subfases pendientes de aprobación por el supervisor."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.02] bg-white/70 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-xl", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
            {trend}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({ type, title, description }: any) {
  const styles: any = {
    critical: "bg-destructive/10 border-destructive/20 text-destructive",
    warning: "bg-amber-100 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-100 text-blue-700",
  };
  
  return (
    <div className={cn("p-4 rounded-xl border flex items-start gap-3", styles[type])}>
      <div className="mt-0.5">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-90">{description}</p>
      </div>
    </div>
  );
}
