// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas públicas (cualquiera puede acceder)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",         // Login de Clerk
  "/sign-up(.*)",         // Registro de Clerk
]);

const isAthenticateRoute = createRouteMatcher([

])


export default clerkMiddleware(async (auth, request) => {
  // 1. Rutas públicas: dejar pasar
 if(!isPublicRoute(request)){
  await auth.protect();
 }

});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}
