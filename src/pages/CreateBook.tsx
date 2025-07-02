import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBookMutation } from '../app/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Zod schema for input validation
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  // ISBN validation: 10 or 13 digits, allowing hyphens but not requiring them in final value
  isbn: z.string()
    .min(10, 'ISBN must be at least 10 characters')
    .max(13, 'ISBN must be at most 13 characters')
    .regex(/^[0-9-]+$/, 'ISBN can only contain numbers and hyphens')
    .transform(val => val.replace(/-/g, '')) // Remove hyphens for final submission/validation
    .refine(val => /^\d{10}(\d{3})?$/.test(val), 'Invalid ISBN format (must be 10 or 13 digits)'),
  description: z.string().optional(),
  copies: z.number().int().min(0, 'Copies cannot be negative'),
});

// Type derived from Zod schema for form data
type BookFormData = z.infer<typeof bookSchema>;

const CreateBook: React.FC = () => {
  const navigate = useNavigate();
  const [createBook, { isLoading }] = useCreateBookMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema), // Integrate Zod with React Hook Form
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      isbn: '',
      description: '',
      copies: 0,
    }
  });

  const onSubmit = async (data: BookFormData) => {
    console.log('Form data being sent:', data);

    // Prepare the book data with the required available field
    const bookData: {
      title: string;
      author: string;
      genre: string;
      isbn: string;
      copies: number;
      available: boolean;
      description?: string;
    } = {
      title: data.title.trim(),
      author: data.author.trim(),
      genre: data.genre.trim(),
      isbn: data.isbn.trim(),
      copies: data.copies,
      available: data.copies > 0, // Set available based on copies count
    };

    // Only include description if it's not empty
    if (data.description && data.description.trim()) {
      bookData.description = data.description.trim();
    }

    console.log('Complete book data being sent:', bookData);
    console.log('Book data as JSON:', JSON.stringify(bookData, null, 2));

    try {
      // RTK Query mutation expects a promise, unwrap to handle errors
      await createBook(bookData).unwrap();
      toast.success('Book added successfully!');
      navigate('/books'); // Redirect to book list
    } catch (err: unknown) {
      console.error('Error creating book:', err);
      console.error('Full error details:', JSON.stringify(err, null, 2));

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
            : "Unknown error";
      toast.error(`Failed to add book: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Add New Book</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title<span className="text-red-500">*</span></label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., The Hitchhiker's Guide to the Galaxy"
          />
          {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">Author<span className="text-red-500">*</span></label>
          <input
            type="text"
            id="author"
            {...register('author')}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Douglas Adams"
          />
          {errors.author && <p className="text-red-500 text-xs italic mt-1">{errors.author.message}</p>}
        </div>

        <div>
          <label htmlFor="genre" className="block text-gray-700 text-sm font-bold mb-2">Genre<span className="text-red-500">*</span></label>
          <input
            type="text"
            id="genre"
            {...register('genre')}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY"
          />
          {errors.genre && <p className="text-red-500 text-xs italic mt-1">{errors.genre.message}</p>}
        </div>

        <div>
          <label htmlFor="isbn" className="block text-gray-700 text-sm font-bold mb-2">ISBN<span className="text-red-500">*</span></label>
          <input
            type="text"
            id="isbn"
            {...register('isbn')}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 978-0345391803 or 0345391802"
          />
          {errors.isbn && <p className="text-red-500 text-xs italic mt-1">{errors.isbn.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="A brief summary of the book..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="copies" className="block text-gray-700 text-sm font-bold mb-2">Total Copies<span className="text-red-500">*</span></label>
          <input
            type="number"
            id="copies"
            {...register('copies', { valueAsNumber: true })} // Ensure value is treated as a number
            min="0"
            className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.copies && <p className="text-red-500 text-xs italic mt-1">{errors.copies.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full text-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default CreateBook;