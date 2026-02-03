
"use client";

import React from 'react';
import { Contact2, Plus, Phone, Mail, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProveedoresPage() {
  const proveedoresMock = [
    { id: 1, nombre: "Aceros del Norte", servicio: "Materiales", ruc: "20123456789", email: "ventas@aceros.com" },
    { id: 2, nombre: "Concretos S.A.", servicio: "Equipos y Mezclas", ruc: "20987654321", email: "contacto@concretos.com" },
    { id: 3, nombre: "Maquinaria Rental", servicio: "Maquinaria Pesada", ruc: "20555666777", email: "alquiler@rental.com" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Proveedores</h1>
            <p className="text-muted-foreground">Directorio de empresas y servicios externos.</p>
          </div>
          <Button className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
          </Button>
        </div>

        <div className="bg-white p-4 rounded-2xl border flex gap-4">
          <Input placeholder="Buscar por nombre o RUC..." className="max-w-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {proveedoresMock.map((prov) => (
            <Card key={prov.id} className="border-none shadow-sm group">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Contact2 className="h-6 w-6 text-slate-500 group-hover:text-primary" />
                </div>
                <CardTitle>{prov.nombre}</CardTitle>
                <CardDescription>{prov.servicio}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> {prov.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> RUC: {prov.ruc}
                  </div>
                </div>
                <Button variant="outline" className="w-full">Ver Historial de Compras</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
