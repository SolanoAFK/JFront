
export interface User {
  id?: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: "ADMIN" | "GERENTE" | "SUPERVISOR";
  password?: string;
}

export type ProjectStatus = "PLANIFICACION" | "EN_PROGRESO" | "COMPLETADO" | "CANCELADO";

export interface Project {
  id?: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  fechaFinReal?: string;
  presupuestoTotal: number;
  presupuestoRestante: number;
  estadoProyecto: ProjectStatus;
  porcentajeCompletado: number;
  estado?: number;
}

export interface Phase {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  proyectoId: number;
  estado?: number;
}

export type SubphaseStatus = "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA";

export interface Subphase {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estadoSubfase: SubphaseStatus;
  faseId: number;
  estado?: number;
}

export interface Supplier {
  id?: number;
  nombre: string;
  ruc: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoServicio: string;
  estado?: number;
}

export type ExpenseType = "MATERIAL" | "MANO_OBRA" | "EQUIPO" | "OTROS";

export interface Expense {
  id?: number;
  descripcion: string;
  monto: number;
  fecha: string;
  proyectoId: number;
  faseId?: number;
  proveedorId?: number;
  tipoGasto: ExpenseType;
  estado?: number;
}

export interface AuthResponse {
  token: string;
}
