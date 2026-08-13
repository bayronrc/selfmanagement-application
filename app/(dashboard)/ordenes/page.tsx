"use client"

import { useApi } from "@/lib/api-client";
import { Order, OrderPaginationResponse } from "@/types/order";
import { useEffect, useState } from "react";
import { columns } from "./partials/columns";
import { DataTable } from "../../../components/data-table";
export default function Page() {
  const { apiFetch } = useApi();

  const [data, setData] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce del texto de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset a página 1 cuando cambia la búsqueda (evita quedar en página inválida)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Único efecto que dispara el fetch
  useEffect(() => {
    let isMounted = true;

    async function cargarDatos() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (debouncedSearch) params.set("search", debouncedSearch);

        const response: OrderPaginationResponse = await apiFetch(
          `/orders/get-orders?${params.toString()}`,
          { method: "GET" }
        );

        if (isMounted) {
          setData(response?.data || []);
          setTotalPages(response?.pages || 1);
          setTotal(response?.total || 0);
        }
      } catch (error) {
        console.error("Error cargando Ordenes: ", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        search={search}
        onSearchChange={setSearch}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}
