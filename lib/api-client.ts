import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export function useApi(){
  const {getToken} = useAuth()

  const apiFetch = useCallback(async (endpoint:string, options?:RequestInit) => {
    const token = await getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
    if (!response.ok)throw new Error(`API error: ${response.status}`)
     return await response.json()
  }, [getToken])

  return {apiFetch}
}
