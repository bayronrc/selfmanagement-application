import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  page: number
  loading: boolean
  totalPages: number
  rowsPerPage: number
  onChangePage: (num: number) => void
  onChangeRowsPerPage: (num: number) => void
}

export function PaginationIconsOnly({
  page,
  loading,
  totalPages,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage
}: Props) {
  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  const handlePrevious = () => {
    if (!isFirstPage && !loading) {
      onChangePage(page - 1)
    }
  }

  const handleNext = () => {
    if (!isLastPage && !loading) {
      onChangePage(page + 1)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(value) => onChangeRowsPerPage(Number(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <button
              onClick={handlePrevious}
              disabled={isFirstPage || loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10"
              aria-label="Go to previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </PaginationItem>

          <PaginationItem>
            <button
              onClick={handleNext}
              disabled={isLastPage || loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10"
              aria-label="Go to next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
