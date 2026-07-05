"use client"

import { useApi } from "@/lib/api-client";
import { OrderPaginationResponse } from "@/types/order";
import { useEffect, useState } from "react";
import { columns } from "./partials/columns";
import { DataTable } from "./partials/data-table";

export default function Page() {

  const { apiFetch } = useApi();

  const [data, setData] = useState<OrderPaginationResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)




  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        const response = await apiFetch(`/orders/get-orders?page=${page}&limit=${limit}`, {
          method: "GET"
        })
        setData(response?.data || [])
        setTotalPages(response?.pages || 1)
      } catch (error) {
        console.error("Error cargando Ordenes: ", error);
      } finally {
        setLoading(false)
      }
    }
    cargarDatos();
  }, [page, limit])



  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage: number) => setPage(newPage)} />
    </div>
  )
}
