import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useGetBorrowSummaryQuery, type BorrowSummaryItem } from "@/app/api/apiSlice"
import { Skeleton } from "@/components/ui/skeleton"

export default function BorrowSummary() {
  const { data, isLoading, isError, error } = useGetBorrowSummaryQuery()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  console.log("Borrow summary data:", data)
  console.log("Data type:", typeof data)
  console.log("Is array:", Array.isArray(data))
  console.log("Data keys:", data ? Object.keys(data) : 'no data')

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Borrowed Books Summary</CardTitle>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">ISBN</TableHead>
                    <TableHead className="font-semibold text-right">Total Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-6 w-8 rounded-full ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Skeleton Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle error state
  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
        ? (error.data as { message: string }).message
        : "Something went wrong";

    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Borrowed Books Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">Error loading data: {errorMessage}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Extract books array from response - handle different response structures
  let books: BorrowSummaryItem[] = [];

  if (data) {
    if (Array.isArray(data)) {
      books = data;
      console.log("Using direct array data:", books);
    } else if (typeof data === 'object' && data !== null) {
      const dataObj = data as Record<string, unknown>;
      console.log("Data object structure:", dataObj);
      if (dataObj.data && Array.isArray(dataObj.data)) {
        books = dataObj.data;
        console.log("Using nested data array:", books);
      }
    }
  }

  console.log("Final books array:", books);
  console.log("Books length:", books.length);
  if (books.length > 0) {
    console.log("First book item:", books[0]);
  }

  // Handle case where no books are found
  if (!books || books.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Borrowed Books Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">No borrowed books found</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  const totalPages = Math.ceil(books.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBooks = books.slice(startIndex, endIndex)

  console.log("Pagination info:", { totalPages, startIndex, endIndex, currentBooks })

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1))
  const goToNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1))

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Borrowed Books Summary</CardTitle>
          <p className="text-muted-foreground">Overview of all borrowed books</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">ISBN</TableHead>
                  <TableHead className="font-semibold text-right">Total Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBooks.length > 0 ? (
                  currentBooks.map((item, index) => {
                    console.log(`Rendering item ${index}:`, item);
                    console.log(`Item properties:`, Object.keys(item));
                    console.log(`Item JSON:`, JSON.stringify(item, null, 2));

                    // Helper function to safely get property value, handling nested objects
                    const getProp = (obj: unknown, ...keys: string[]): unknown => {
                      for (const key of keys) {
                        if (obj && typeof obj === 'object' && key in obj) {
                          const value = (obj as Record<string, unknown>)[key];
                          if (value != null) {
                            return value;
                          }
                        }
                      }
                      return null;
                    };

                    // Helper to get nested property (e.g., book.title)
                    const getNestedProp = (obj: unknown, path: string): unknown => {
                      if (!obj || typeof obj !== 'object') return null;
                      const keys = path.split('.');
                      let current: unknown = obj;
                      for (const key of keys) {
                        if (current && typeof current === 'object' && key in current) {
                          current = (current as Record<string, unknown>)[key];
                        } else {
                          return null;
                        }
                      }
                      return current;
                    };

                    // Try different possible property names and handle nested objects
                    let title = getProp(item, 'bookTitle', 'title') || getNestedProp(item, 'book.title');
                    let isbn = getProp(item, 'bookISBN', 'isbn') || getNestedProp(item, 'book.isbn');
                    let quantity = getProp(item, 'totalQuantityBorrowed', 'totalQuantity', 'quantity') || 0;

                    // If we got objects, try to extract string values
                    if (title && typeof title === 'object') {
                      title = getProp(title, 'title', 'name', 'bookTitle') || 'Unknown Title';
                    }
                    if (isbn && typeof isbn === 'object') {
                      isbn = getProp(isbn, 'isbn', 'bookISBN') || 'Unknown ISBN';
                    }

                    // Ensure we have fallback values
                    title = title || 'Unknown Title';
                    isbn = isbn || 'Unknown ISBN';
                    quantity = quantity || 0;

                    console.log(`Extracted values:`, { title, isbn, quantity });

                    return (
                      <TableRow key={String(getProp(item, 'bookISBN', 'isbn', 'bookId') || index)} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {String(title)}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {String(isbn)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {Number(quantity)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No data to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, books.length)} of {books.length} books
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goToFirstPage} disabled={currentPage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={goToLastPage} disabled={currentPage === totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
