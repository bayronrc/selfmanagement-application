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
      icon: <HeartPulseIcon className="size-6 text-rose-500" />,
      title: "Gestión Integral",
      description: "Administra pacientes, citas y órdenes médicas en un solo lugar.",
      color: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    },
    {
      icon: <ShieldCheckIcon className="size-6 text-emerald-500" />,
      title: "Datos Seguros",
      description: "Protección avanzada de datos sensibles con cifrado de extremo a extremo.",
      color: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
    },
    {
      icon: <ClockIcon className="size-6 text-blue-500" />,
      title: "Ahorro de Tiempo",
      description: "Automatiza procesos y reduce el tiempo administrativo en un 60%.",
      color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    },
    {
      icon: <StethoscopeIcon className="size-6 text-violet-500" />,
      title: "Multi-Especialidad",
      description: "Soporte para todas las especialidades médicas y quirúrgicas.",
      color: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* --- Navbar --- */}
      <header className="container mx-auto flex items-center justify-between py-6 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-emerald-500/20">
            <HeartPulseIcon className="size-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            MediApp
          </span>
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
              <Button variant="ghost" className="hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors">
                Iniciar Sesión
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all">
                Registrarse
              </Button>
            </SignUpButton>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <main className="container mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30 px-4 py-1.5 text-sm font-medium text-teal-700 dark:text-teal-400">
              <HeartPulseIcon className="size-4" />
              Plataforma Médica
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Gestiona tu{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
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
                  <Button size="lg" className="text-base px-8 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                    Ir al Dashboard →
                  </Button>
                </Link>
              ) : (
                <SignUpButton>
                  <Button size="lg" className="text-base px-8 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                    Comenzar Gratis
                  </Button>
                </SignUpButton>
              )}

              {!userId && (
                <SignInButton>
                  <Button size="lg" variant="outline" className="text-base px-8 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
                    Ya tengo cuenta
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Right: Carousel */}
          <div className="relative">
            <MedicalCarousel />
            {/* Decorative gradient blob */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-[2rem] blur-3xl" />
          </div>
        </div>

        {/* --- Features --- */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} border border-white/50 dark:border-white/10 hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="container mx-auto px-4 md:px-8 py-10 text-center text-sm text-muted-foreground mt-24 border-t border-teal-100 dark:border-teal-900/50">
        <p>© {new Date().getFullYear()} MediApp. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
