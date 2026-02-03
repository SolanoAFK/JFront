
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HardHat, LogIn, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';

const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/login', data);
      await login(response.data.token);
      toast({
        title: "Bienvenido",
        description: "Sesión iniciada correctamente",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error.response?.data?.message || "Credenciales incorrectas",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 animate-bounce">
            <HardHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline">BuildFlow</h1>
          <p className="text-slate-500 font-medium">Sistema de Gestión de Obras</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input placeholder="admin" {...field} className="pl-10 h-11 rounded-xl" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input type="password" placeholder="••••••••" {...field} className="pl-10 h-11 rounded-xl" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Cargando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" /> Entrar
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4 pb-8">
            <div className="text-sm text-slate-500">
              ¿No tienes cuenta? <span className="text-primary font-semibold hover:underline cursor-pointer">Contacta al administrador</span>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full px-4">
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Demo User</p>
                <p className="text-xs font-mono font-medium">admin</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Password</p>
                <p className="text-xs font-mono font-medium">admin123</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
