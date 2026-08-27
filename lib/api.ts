import { auth } from "@clerk/nextjs/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function apiFetch(endpoint:string,options?:RequestInit) {
  const {getToken} = await auth();
  const token = await getToken()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
    console.log(process.env.NEXT_PUBLIC_API_URL)
  return response.json()
}
