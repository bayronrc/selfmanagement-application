"use client";

import { useAuth } from "@clerk/nextjs";
import React from "react";

interface ProtectProps {
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Protect({
  permission,
  role,
  fallback = null,
  children,
}: ProtectProps) {
  const { isLoaded, has } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!has) {
    return <>{fallback}</>;
  }

  if (permission && !has({ permission })) {
    return <>{fallback}</>;
  }

  if (role && !has({ role })) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
