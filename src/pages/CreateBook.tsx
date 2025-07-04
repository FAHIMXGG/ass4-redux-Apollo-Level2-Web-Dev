"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateBookMutation } from '../app/api/apiSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, BookOpen, Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Genre options
const genres = [
  'FICTION', ' NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'
]

// Zod schema for input validation
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  // ISBN validation: 10 or 13 digits, allowing hyphens but not requiring them in final value
  isbn: z.string()
    .min(10, 'ISBN must be at least 10 characters')
    .max(17, 'ISBN must be at most 17 characters (including hyphens)')
    .regex(/^[0-9-]+$/, 'ISBN can only contain numbers and hyphens')
    .transform(val => val.replace(/-/g, '')) // Remove hyphens for final submission/validation
    .refine(val => /^\d{10}(\d{3})?$/.test(val), 'Invalid ISBN format (must be 10 or 13 digits)'),
  description: z.string().optional(),
  copies: z.number().int().min(1, 'Total copies must be at least 1'),
})

// Type derived from Zod schema for form data
type BookFormData = z.infer<typeof bookSchema>

const CreateBook: React.FC = () => {
  const navigate = useNavigate()
  const [createBook, { isLoading }] = useCreateBookMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      isbn: '',
      description: '',
      copies: 1,
    }
  })

  const selectedGenre = watch('genre')

  const onSubmit = async (data: BookFormData) => {
    console.log('Form data being sent:', data)

    // Prepare the book data with the required available field
    const bookData: {
      title: string
      author: string
      genre: string
      isbn: string
      copies: number
      available: boolean
      description?: string
    } = {
      title: data.title.trim(),
      author: data.author.trim(),
      genre: data.genre.trim(),
      isbn: data.isbn.trim(),
      copies: data.copies,
      available: data.copies > 0, // Set available based on copies count
    }

    // Only include description if it's not empty
    if (data.description && data.description.trim()) {
      bookData.description = data.description.trim()
    }

    console.log('Complete book data being sent:', bookData)
    console.log('Book data as JSON:', JSON.stringify(bookData, null, 2))

    try {
      await createBook(bookData).unwrap()
      toast.success('Book added successfully!')
      navigate('/books')
    } catch (err: unknown) {
      console.error('Error creating book:', err)
      console.error('Full error details:', JSON.stringify(err, null, 2))

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
      toast.error(`Failed to add book: ${errorMessage}`)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Add New Book
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
                min="1"
                {...register('copies', { valueAsNumber: true })}
              />
              {errors.copies && (
                <p className="text-sm text-destructive">{errors.copies.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Adding Book...' : 'Add Book'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateBook