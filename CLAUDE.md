# Proyecto: API Médica - Frontend

## Stack
- Next.js 15, App Router, TypeScript estricto
- Tailwind CSS
- Clerk para autenticación (JWT via JWKS)
- Backend: FastAPI en http://localhost:8000

## Patrones obligatorios

### Componentes
- Server Components por defecto, Client Components solo cuando sea necesario
- Marcar con `"use client"` únicamente si necesita hooks, eventos o estado
- Nombrar archivos en kebab-case: `appointment-list.tsx`

### Llamadas al backend
- Siempre incluir el JWT de Clerk en el header Authorization
- Server Components: usar `auth()` de Clerk para obtener el token
- Client Components: usar `useAuth()` de Clerk

### Ejemplo de fetch autenticado (Server Component)
\`\`\`typescript
import { auth } from "@clerk/nextjs/server";

const { getToken } = await auth();
const token = await getToken();

const res = await fetch("http://localhost:8000/appointments", {
  headers: { Authorization: `Bearer ${token}` }
});
\`\`\`

### Estructura de carpetas
- app/ → rutas y layouts
- components/ → componentes reutilizables
- lib/ → helpers, tipos, fetch wrappers
- hooks/ → custom hooks del cliente

## Convenciones de nombres
- Rutas: app/appointments/page.tsx
- Componentes: PascalCase en el componente, kebab-case en el archivo
- Tipos: en lib/types.ts o junto al módulo que los usa

## Lo que NO hacer
- No usar Pages Router
- No hacer fetch al backend desde Client Components sin necesidad
- No hardcodear URLs, usar variables de entorno
