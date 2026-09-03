import { auth } from "@clerk/nextjs/server";

export async function apiFetch(endpoint:string,options?:RequestInit) {
  const {getToken} = await auth();
  const token = await getToken()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json()
}
