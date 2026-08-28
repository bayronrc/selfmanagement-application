import { useAuth } from "@clerk/nextjs";

export function useApi() {
  const { getToken } = useAuth();

  async function apiFetch(endpoint: string, options?: RequestInit) {
    const token = await getToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          errorMessage = typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
        }
      } catch (_) {
        // Fallback al status por defecto si no es JSON
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  return { apiFetch };
}
