"use client"

import { useState } from "react";
import * as XLSX from "xlsx";
import { apiFetch } from "../lib/api";


export function ExcelUploader() {
  const [errors, setErrors] = useState<string[]>([])
  const [filename, setFilename] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setErrors([])
    setFilename(file.name)

    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    try {
      setLoading(true)
      await apiFetch("/orders/batches", {
        method: "POST",
        body: JSON.stringify({ filename: file.name, rows: rows })
      })
    } catch (error) {

    }
  }
}
