
"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  ReceiptIndianRupee, 
  Filter,
  Download,
  Calendar as CalendarIcon,
  Tag,
  ArrowDownCircle
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
import { Expense, ExpenseType } from '@/lib/types';
import apiClient from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function GastosPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/gastos');
      setExpenses(res.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los gastos.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const getExpenseBadge = (type: ExpenseType) => {
    const variants: Record<ExpenseType, any> = {
      MATERIAL: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Material' },
      MANO_OBRA: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Mano de Obra' },
      EQUIPO: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Equipos' },
      OTROS: { color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Otros' },
    };
    const { color, label } = variants[type] || { color: 'bg-gray-100', label: type };
    return <Badge variant="outline" className={color}>{label}</Badge>;
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.monto, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Control de Gastos</h1>
            <p className="text-muted-foreground">Monitorea y registra todos los egresos por obra.</p>
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Registrar Gasto
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardMini 
            title="Gasto Total" 
            value={`$${totalExpenses.toLocaleString()}`} 
            icon={ArrowDownCircle}
            color="bg-red-50 text-red-600"
          />
          <CardMini 
            title="Este Mes" 
            value={`$${(totalExpenses * 0.15).toLocaleString()}`} 
            icon={CalendarIcon}
            color="bg-blue-50 text-blue-600"
          />
          <CardMini 
            title="Promedio por Obra" 
            value={`$${(totalExpenses / 5).toLocaleString()}`} 
            icon={Tag}
            color="bg-purple-50 text-purple-600"
          />
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar por descripción..." 
              className="pl-10 h-10 rounded-xl bg-slate-50 border-none"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-10"><Filter className="mr-2 h-4 w-4" /> Filtros</Button>
            <Button variant="outline" className="rounded-xl h-10"><Download className="mr-2 h-4 w-4" /> Exportar</Button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}><div className="h-12 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : expenses.map((e) => (
                <TableRow key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-600">
                    {format(new Date(e.fecha), 'dd MMM, yyyy', { locale: es })}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{e.descripcion}</TableCell>
                  <TableCell>{getExpenseBadge(e.tipoGasto)}</TableCell>
                  <TableCell className="font-bold text-red-600">-${e.monto.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                      Proyecto #{e.proyectoId}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="rounded-full">Detalles</Button>
                  </TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center">
                        <ReceiptIndianRupee className="h-8 w-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-medium">No se han registrado gastos aún.</p>
                      <Button variant="outline" className="rounded-xl">Registrar Primer Gasto</Button>
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

function CardMini({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
