
"use client";

import React from 'react';
import { Layers, Plus, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FasesPage() {
  const fasesMock = [
    { id: 1, nombre: "Cimentación", proyecto: "Edificio Norte", progreso: 100, estado: "COMPLETADA" },
    { id: 2, nombre: "Estructura Principal", proyecto: "Torre Titanium", progreso: 45, estado: "EN_PROGRESO" },
    { id: 3, nombre: "Instalaciones Eléctricas", proyecto: "Residencial Jardines", progreso: 10, estado: "EN_PROGRESO" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Fases y Etapas</h1>
            <p className="text-muted-foreground">Control detallado de las etapas de cada obra.</p>
          </div>
          <Button className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Nueva Fase
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fasesMock.map((fase) => (
            <Card key={fase.id} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant={fase.estado === "COMPLETADA" ? "default" : "secondary"}>
                    {fase.estado}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg">{fase.nombre}</CardTitle>
                <CardDescription>{fase.proyecto}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progreso</span>
                    <span>{fase.progreso}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all" 
                      style={{ width: `${fase.progreso}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                    <Calendar className="h-3 w-3" />
                    Actualizado hoy
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
