"use client"

import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetBookByIdQuery, useUpdateBookMutation } from '@/app/api/apiSlice'
import toast from 'react-hot-toast'
import { ArrowLeft, BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookCardSkeleton } from '@/components/skeletons'

// Zod schema for edit form validation
const bookEditSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  isbn: z.string()
    .min(10, 'ISBN must be at least 10 characters')
    .max(17, 'ISBN must be at most 17 characters (including hyphens)')
    .regex(/^[0-9-]+$/, 'ISBN can only contain numbers and hyphens')
    .transform(val => val.replace(/-/g, ''))
    .refine(val => /^\d{10}(\d{3})?$/.test(val), 'Invalid ISBN format (must be 10 or 13 digits)'),
  description: z.string().optional(),
  copies: z.number().int().min(0, 'Copies cannot be negative'),
})

type BookEditFormData = z.infer<typeof bookEditSchema>

const genres = [
'FICTION', ' NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'
]

export default function EditBook() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  console.log('Book ID from URL:', id)

  const { data: book, isLoading: isBookLoading, isError: isBookError, error: bookError } = useGetBookByIdQuery(id!)
  console.log('Book data:', book)
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookEditFormData>({
    resolver: zodResolver(bookEditSchema),
  })

  const selectedGenre = watch('genre')

  // Populate form fields once book data is loaded
  useEffect(() => {
    if (book) {
      console.log('Book data loaded:', book)
      console.log('Book ID from URL:', id)
      console.log('Book _id from data:', book.data._id)

      const formData = {
        title: book.data.title,
        author: book.data.author,
        genre: book.data.genre,
        isbn: book.data.isbn,
        description: book.data.description || '',
        copies: book.data.copies,
      }
      console.log('Resetting form with:', formData)
      reset(formData)
    }
  }, [book, reset, id])

  const onSubmit = async (data: BookEditFormData) => {
    if (!id) {
      toast.error('Book ID is missing for update.')
      return
    }

    try {
      const updateData = {
        _id: id,
        ...data,
        available: data.copies > 0, // Set available based on copies count
      }

      console.log('Updating book with ID:', id)
      console.log('Update data:', updateData)
      console.log('Original book data:', book)

      const result = await updateBook(updateData).unwrap()
      console.log('Update result:', result)

      toast.success('Book updated successfully!')
      navigate('/books')
    } catch (err: unknown) {
      console.error('Error updating book:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))

      let errorMessage = 'Failed to update book'

      if (err && typeof err === 'object') {
        if ('status' in err) {
          const status = (err as { status: number }).status
          if (status === 404) {
            errorMessage = `Book not found (ID: ${id}). The book may have been deleted.`
          } else if (status === 400) {
            errorMessage = 'Invalid book data. Please check your input.'
          } else if (status === 500) {
            errorMessage = 'Server error. Please try again later.'
          }
        }

        if ('data' in err && err.data && typeof err.data === 'object' && 'message' in err.data) {
          errorMessage = (err.data as { message: string }).message
        } else if ('message' in err) {
          errorMessage = (err as { message: string }).message
        }
      }

      toast.error(errorMessage)
    }
  }

  // Handle loading state
  if (isBookLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <BookCardSkeleton />
      </div>
    )
  }

  // Handle error state
  if (isBookError || !book) {
    const errorMessage =
      bookError && typeof bookError === 'object' && 'data' in bookError && bookError.data && typeof bookError.data === 'object' && 'message' in bookError.data
        ? (bookError.data as { message: string }).message
        : 'Book not found'

    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Edit Book
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-destructive mb-4">Error: {errorMessage}</div>
              <Button onClick={() => navigate('/books')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Books
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Edit "{book.data.title}"
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
                defaultValue={book.data.title}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Author Field */}
            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                {...register('author')}
                placeholder="e.g., Douglas Adams"
                defaultValue={book.data.author}
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author.message}</p>
              )}
            </div>

            {/* Genre Field */}
            <div className="space-y-2">
              <Label htmlFor="genre">
                Genre <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedGenre}
                onValueChange={(value) => setValue('genre', value)}
                defaultValue={book.data.genre}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-sm text-destructive">{errors.genre.message}</p>
              )}
            </div>

            {/* ISBN Field */}
            <div className="space-y-2">
              <Label htmlFor="isbn">
                ISBN <span className="text-destructive">*</span>
              </Label>
              <Input
                id="isbn"
                {...register('isbn')}
                placeholder="e.g., 978-0345391803 or 0345391802"
                defaultValue={book.data.isbn}
              />
              {errors.isbn && (
                <p className="text-sm text-destructive">{errors.isbn.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Brief description of the book (optional)"
                rows={3}
                defaultValue={book.data.description || ''}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Copies Field */}
            <div className="space-y-2">
              <Label htmlFor="copies">
                Total Copies <span className="text-destructive">*</span>
              </Label>
              <Input
                id="copies"
                type="number"
                min="0"
                {...register('copies', { valueAsNumber: true })}
                defaultValue={book.data.copies}
              />
              {errors.copies && (
                <p className="text-sm text-destructive">{errors.copies.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? 'Updating Book...' : 'Update Book'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}