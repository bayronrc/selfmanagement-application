import { useAuth } from "@clerk/nextjs";

export function useApi(){
  const {getToken} = useAuth()

  async function apiFetch(endpoint:string, options?:RequestInit) {
    const token = getToken();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
    if (!response.ok)throw new Error(`API error: ${response.status}`)
      response.json()
  }
}
