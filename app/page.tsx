import { Button } from "@/components/ui/button"; // Asegúrate de tener este componente de shadcn
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function HomePage() {
  // Verificamos la sesión del lado del servidor
  const { userId } = await auth();


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* --- Navbar --- */}
      <header className="container mx-auto flex items-center justify-between py-6 px-4 md:px-8">
        <div className="flex items-center gap-2">
          {/* Reemplaza esto con tu Logo o nombre */}
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="font-bold text-xl tracking-tight">SelfManagement</span>
        </div>

        {/* Controles de Autenticación */}
        {userId ? (
          <UserButton
            afterSwitchSessionUrl="/dashboard"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9"
              }
            }}
          />
        ) : (
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <Button variant="ghost">Iniciar Sesión</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Registrarse</Button>
            </SignUpButton>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <main className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center mt-20 md:mt-32">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-6">
          Nuevo: Integración con OAuth
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl max-w-4xl">
          Gestiona tus proyectos de <span className="text-primary">ingeniería</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          La plataforma definitiva para organizar tareas, documentos y equipos.
          Simplifica tu flujo de trabajo desde el primer día.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {userId ? (
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8">
                Ir al Dashboard →
              </Button>
            </Link>
          ) : (
            <SignUpButton >
              <Button size="lg" className="text-base px-8">
                Comenzar Gratis
              </Button>
            </SignUpButton>
          )}

          {!userId && (
            <SignInButton >
              <Button size="lg" variant="outline" className="text-base px-8">
                Ya tengo cuenta
              </Button>
            </SignInButton>
          )}
        </div>
      </main>

      {/* --- Footer Simple --- */}
      <footer className="container mx-auto px-4 md:px-8 py-10 text-center text-sm text-muted-foreground mt-20 border-t">
        <p>© {new Date().getFullYear()} SelfManagement. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
