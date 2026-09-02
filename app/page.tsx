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
      icon: <HeartPulseIcon className="size-6 text-orange-500" />,
      title: "Gestión Integral",
      description: "Administra pacientes, citas y órdenes médicas en un solo lugar.",
      color: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    },
    {
      icon: <ShieldCheckIcon className="size-6 text-blue-600" />,
      title: "Datos Seguros",
      description: "Protección avanzada de datos sensibles con cifrado de extremo a extremo.",
      color: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-950/20",
    },
    {
      icon: <ClockIcon className="size-6 text-orange-500" />,
      icon: <ClockIcon className="size-6 text-orange-500" />,
      title: "Ahorro de Tiempo",
      description: "Automatiza procesos y reduce el tiempo administrativo en un 60%.",
      color: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    },
    {
      icon: <StethoscopeIcon className="size-6 text-blue-700" />,
      title: "Multi-Especialidad",
      description: "Soporte para todas las especialidades médicas y quirúrgicas.",
      color: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* --- Navbar --- */}
      <header className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <HeartPulseIcon className="size-5 text-white" />
              </div>
              <div className="grid">
                <span className="font-bold text-xl leading-tight text-white">
                  MediApp
                </span>
                <span className="text-xs text-blue-100">proinsalud</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/share/1GSdQwq9q2/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-blue-500 hover:scale-110 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-pink-500 hover:scale-110 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-gray-800 hover:scale-110 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
            {userId && (
              <UserButton
                afterSwitchSessionUrl="/dashboard"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            )}
          </div>

          {userId ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-proinsalud.jpg"
                alt="Proinsalud"
                className="h-10 w-auto rounded-lg"
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle className="text-white hover:text-white hover:bg-white/20" />
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 transition-colors">
                  Iniciar Sesión
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-900/30 transition-all">
                  Registrarse
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </header>

      {/* --- Hero Carousel Banner --- */}
      <div className="w-full">
        <MedicalCarousel />
      </div>

      {/* --- Hero Section --- */}
      <main className="container mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="space-y-8">
          {/* Text */}
          <div className="space-y-8 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 px-4 py-1.5 text-sm font-medium text-orange-700 dark:text-orange-400">
              <HeartPulseIcon className="size-4" />
              Plataforma Médica
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Gestiona tu{" "}
              <span className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                clínica
              </span>{" "}
              de forma inteligente
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              La plataforma definitiva para organizar pacientes, citas, profesionales y órdenes médicas.
              Simplifica tu flujo de trabajo desde el primer día.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {userId ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-base px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30">
                    Ir al Dashboard →
                  </Button>
                </Link>
              ) : (
                <SignUpButton>
                  <Button size="lg" className="text-base px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30">
                    Comenzar Gratis
                  </Button>
                </SignUpButton>
              )}

              {!userId && (
                <SignInButton>
                  <Button size="lg" variant="outline" className="text-base px-8 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-800 transition-colors">
                    Ya tengo cuenta
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* --- Features --- */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full py-10 text-center text-sm text-white bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 mt-24">
        <p>© {new Date().getFullYear()} MediApp. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
