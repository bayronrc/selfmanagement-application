import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { MedicalCarousel } from "@/components/medical-carousel";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  HeartPulseIcon,
  ShieldCheckIcon,
  ClockIcon,
  StethoscopeIcon,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();

  const features = [
    {
      icon: <HeartPulseIcon className="size-6 text-orange-500" />,
      title: "Gestión Integral",
      description: "Administra pacientes, citas y órdenes médicas en un solo lugar.",
      color: "from-blue-50 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20",
    },
    {
      icon: <ShieldCheckIcon className="size-6 text-orange-500" />,
      title: "Datos Seguros",
      description: "Protección avanzada de datos sensibles con cifrado de extremo a extremo.",
      color: "from-blue-50 to-blue-50 dark:from-blue-950/30 dark:to-blue-950/30",
    },
    {
      icon: <ClockIcon className="size-6 text-orange-500" />,
      title: "Ahorro de Tiempo",
      description: "Automatiza procesos y reduce el tiempo administrativo en un 60%.",
      color: "from-blue-50 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-950/30",
    },
    {
      icon: <StethoscopeIcon className="size-6 text-orange-500" />,
      title: "Multi-Especialidad",
      description: "Soporte para todas las especialidades médicas y quirúrgicas.",
      color: "from-blue-50 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20",
    },
  ];

  return (
    <div className="min-h-screen text-foreground overflow-hidden">
      {/* --- Header / Navbar azul --- */}
      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 shadow-lg shadow-blue-900/30">
        <nav className="container mx-auto flex items-center justify-between py-5 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <HeartPulseIcon className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white">MediApp</span>
              <span className="text-xs text-blue-100">Proinsalud</span>
            </div>
          </Link>

          {userId ? (
            <UserButton
              afterSwitchSessionUrl="/dashboard"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/15 transition-colors">
                  Iniciar Sesión
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-900/30 transition-all">
                  Registrarse
                </Button>
              </SignUpButton>
            </div>
          )}
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <main className="container mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 dark:border-orange-800 dark:bg-orange-950/30 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
              <HeartPulseIcon className="size-4" />
              Plataforma Médica
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Gestiona tu{" "}
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                clínica
              </span>{" "}
              de forma inteligente
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              La plataforma definitiva para organizar pacientes, citas, profesionales y órdenes médicas.
              Simplifica tu flujo de trabajo desde el primer día.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {userId ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-base px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30">
                    Ir al Dashboard →
                  </Button>
                </Link>
              ) : (
                <SignUpButton>
                  <Button size="lg" className="text-base px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30">
                    Comenzar Gratis
                  </Button>
                </SignUpButton>
              )}

              {!userId && (
                <SignInButton>
                  <Button size="lg" variant="outline" className="text-base px-8 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors">
                    Ya tengo cuenta
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          <div className="relative">
            <MedicalCarousel />
            <div className="absolute -z-10 -inset-4 bg-gradient-to-br from-orange-300/30 to-blue-400/30 rounded-[2rem] blur-3xl" />
          </div>
        </div>

        {/* --- Features --- */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border border-blue-100 dark:border-white/10 hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* --- Footer azul --- */}
      <footer className="mt-24 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 border border-white/20">
                <HeartPulseIcon className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">MediApp</span>
                <span className="text-xs text-blue-200">Proinsalud</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <span className="inline-block size-2 rounded-full bg-orange-400" />
              Sistema de gestión de salud
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/15 text-center text-sm text-blue-200">
            © {new Date().getFullYear()} MediApp · Proinsalud. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
