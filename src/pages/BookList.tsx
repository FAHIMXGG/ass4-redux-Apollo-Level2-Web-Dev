import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { Edit, Trash2, BookOpen, Plus } from "lucide-react"

import { useGetBooksQuery, useDeleteBookMutation } from "../app/api/apiSlice"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookListSkeleton } from "@/components/skeletons"


interface Book {
  _id: string
  title: string
  author: string
  genre: string
  isbn: string
  copies: number
  available: boolean
  availableCopies: number
}

const BookList: React.FC = () => {
  const [itemsToShow, setItemsToShow] = useState(10)
  const { data, isLoading, isError, error } = useGetBooksQuery({ limit: itemsToShow })
  const [deleteBook] = useDeleteBookMutation()

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id).unwrap()
      toast.success("Book deleted successfully!")
    } catch (err: unknown) {
      const errorMessage =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? (err.data as { message: string }).message
          : err instanceof Error
            ? err.message
            : "Unknown error"
      toast.error(`Failed to delete book: ${errorMessage}`)
    }
  }

  if (isLoading) {
    return <BookListSkeleton itemsToShow={itemsToShow} />
  }

  if (isError) {
    const errorMessage =
      error && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
        ? (error.data as { message: string }).message
        : "Please try again later."

    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>
              <div className="font-semibold">Error loading books!</div>
              <div>{errorMessage}</div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const books: Book[] = data?.data || []
  const totalBooks = books.length

  // Create pagination options for different amounts of data
  const paginationOptions = [ 10, 15, 20, 25, 30]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold">Library Books</CardTitle>
          <Button asChild>
            <Link to="/create-book" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Book
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Total Copies</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No books found in the library.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                    <TableCell>{book.copies}</TableCell>
                    <TableCell>
                      <Badge variant={book.available ? "default" : "secondary"}>
                        {book.available ? "Available" : "Unavailable"} ({book.copies})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/edit-book/${book._id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit book</span>
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete book</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the book "{book.title}" from
                                the library.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(book._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className={!book.available ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Link to={`/borrow/${book._id}`} onClick={(e) => !book.available && e.preventDefault()}>
                            <BookOpen className="h-4 w-4" />
                            <span className="sr-only">
                              {!book.available ? "No copies available to borrow" : "Borrow book"}
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Show different amounts of data */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {totalBooks} books (requested {itemsToShow})
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              {paginationOptions.map((option) => (
                <Button
                  key={option}
                  variant={itemsToShow === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setItemsToShow(option)}
                  className="min-w-[50px]"
                >
                  {option}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItemsToShow(Math.min(itemsToShow + 10, 100))}
                className="ml-2"
                disabled={itemsToShow >= 100}
              >
                +10 More
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookList
