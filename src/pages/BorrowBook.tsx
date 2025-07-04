"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, BookOpen, Calendar, Hash, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookCardSkeleton } from "@/components/skeletons"
import { useBorrowBookMutation, useGetBookByIdQuery } from '@/app/api/apiSlice'

// Base Zod schema for borrow form validation
const createBorrowSchema = (maxCopies: number) => z.object({
  book: z.string().min(1, 'Please select a book'),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(maxCopies, `Cannot borrow more than ${maxCopies} ${maxCopies === 1 ? 'copy' : 'copies'}`),
  dueDate: z.string().min(1, 'Due date is required'),
})

type BorrowFormData = {
  book: string
  quantity: number
  dueDate: string
}

const BorrowBook: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()

  const { data: bookResponse, isLoading: isBookLoading, isError: isBookError,  } = useGetBookByIdQuery(bookId!)
  console.log('Book data:', bookResponse)
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation()

  // Get the specific book data
  const currentBook = bookResponse?.data
  console.log('Current book:', currentBook)
  const maxCopies = currentBook?.copies || 1
  console.log('Max copies:', maxCopies)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BorrowFormData>({
    resolver: zodResolver(createBorrowSchema(maxCopies)),
    defaultValues: {
      book: bookId || '',
      quantity: 1,
      dueDate: '',
    }
  })

  const selectedQuantity = watch('quantity')

  // Set default due date to 2 weeks from now
  React.useEffect(() => {
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)
    const defaultDueDate = twoWeeksFromNow.toISOString().split('T')[0]
    setValue('dueDate', defaultDueDate)
  }, [setValue])

  // Update form validation when book data changes
  React.useEffect(() => {
    if (currentBook) {
      // Reset form with new validation schema
      reset({
        book: bookId || '',
        quantity: Math.min(selectedQuantity || 1, currentBook.copies),
        dueDate: watch('dueDate'),
      })
    }
  }, [currentBook, bookId, reset, selectedQuantity, watch])

  const onSubmit = async (data: BorrowFormData) => {
    try {
      // Format the data according to your API specification
      const borrowData = {
        book: data.book,
        quantity: data.quantity,
        dueDate: new Date(data.dueDate).toISOString(),
      }

      console.log('Borrowing book with data:', borrowData)

      await borrowBook(borrowData).unwrap()
      toast.success('Book borrowed successfully!')
      navigate('/borrow-summary')
    } catch (err: unknown) {
      console.error('Error borrowing book:', err)

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
            : "Failed to borrow book"

      toast.error(errorMessage)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Borrow a Book
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/books')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
        </CardHeader>
        <CardContent>
          {isBookLoading ? (
            <BookCardSkeleton />
          ) : isBookError ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading book. Please try again.</p>
            </div>
          ) : !currentBook ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Book not found.</p>
            </div>
          ) : !currentBook.available || currentBook.copies === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">This book is currently not available for borrowing.</p>
              <div className="mt-4">
                <Button onClick={() => navigate('/books')} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Books
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Book Info Display */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium text-lg">{currentBook.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-muted-foreground">by {currentBook.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">ISBN: {currentBook.isbn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {currentBook.copies} copies available
                      </Badge>
                      <Badge variant="secondary">
                        {currentBook.genre}
                      </Badge>
                    </div>
                    {currentBook.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {currentBook.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quantity Field */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-destructive">*</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    (Max: {currentBook.copies})
                  </span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newValue = Math.max(1, selectedQuantity - 1)
                      setValue('quantity', newValue)
                    }}
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={currentBook.copies}
                    className="text-center"
                    {...register('quantity', { valueAsNumber: true })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newValue = Math.min(currentBook.copies, selectedQuantity + 1)
                      setValue('quantity', newValue)
                    }}
                    disabled={selectedQuantity >= currentBook.copies}
                  >
                    +
                  </Button>
                </div>
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity.message}</p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Available: {currentBook.copies} copies</span>
                  <span>Selected: {selectedQuantity} {selectedQuantity === 1 ? 'copy' : 'copies'}</span>
                </div>
              </div>

              {/* Due Date Field */}
              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('dueDate')}
                  />
                </div>
                {errors.dueDate && (
                  <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isBorrowing ||
                  !currentBook ||
                  selectedQuantity < 1 ||
                  selectedQuantity > currentBook.copies ||
                  Object.keys(errors).length > 0
                }
                className="w-full"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {isBorrowing ? 'Borrowing...' : `Borrow ${selectedQuantity} ${selectedQuantity === 1 ? 'Copy' : 'Copies'}`}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BorrowBook