import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  User,
  Hash,
  Calendar,
  FileText,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  Share2,
  Heart,
  BookMarked,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/alert-dialog";
import { BookCardSkeleton } from "@/components/skeletons";
import { useGetBookByIdQuery, useDeleteBookMutation } from "@/app/api/apiSlice";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: bookResponse, isLoading, isError } = useGetBookByIdQuery(id!, {
    pollingInterval: 3000,
  });
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const book = bookResponse?.data;
  console.log("Book data:", book);

  const handleDelete = async () => {
    if (!book) return;

    try {
      await deleteBook(book._id).unwrap();
      toast.success("Book deleted successfully!");
      navigate("/books");
    } catch (err: unknown) {
      console.error("Error deleting book:", err);
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
      toast.error(`Failed to delete book: ${errorMessage}`);
    }
  };

  const handleShare = async () => {
    if (!book) return;

    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" by ${book.author}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const copyISBN = async () => {
    if (!book) return;
    await navigator.clipboard.writeText(book.isbn);
    toast.success("ISBN copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <BookCardSkeleton />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Book Not Found</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/books")} className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header with Navigation */}
      <div className="flex sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <Button
          variant="ghost"
          onClick={() => navigate("/books")}
          className="flex items-center gap-2 self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Back to Books</span>
          <span className="xs:hidden">Back</span>
        </Button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Main Book Information */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
            <div className="space-y-2 flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 mt-1 sm:mt-0" />
                <span className="break-words">{book.title}</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-base sm:text-lg text-muted-foreground">
                <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-words">by {book.author}</span>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
              <Badge
                variant={book.available ? "default" : "destructive"}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                {book.available ? "Available" : "Not Available"}
              </Badge>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {book.copies} copies available
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          {/* Book Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    ISBN
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-mono text-sm sm:text-base break-all">{book.isbn}</p>
                    <Button variant="ghost" size="sm" onClick={copyISBN} className="flex-shrink-0">
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookMarked className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Genre
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs sm:text-sm">
                    {book.genre.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Total Copies
                  </p>
                  <p className="text-base sm:text-lg font-semibold">{book.copies}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Added to Library
                  </p>
                  <p className="text-sm sm:text-base">
                    {new Date(
                      book.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <h3 className="text-base sm:text-lg font-semibold">Description</h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(`/edit-book/${book._id}`)}
              className="w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Book
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Book
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base sm:text-lg">Delete Book</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm sm:text-base">
                    Are you sure you want to delete "{book.title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Book"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Availability Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Availability Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-muted-foreground">Available:</span>
                <span className="text-sm sm:text-base font-semibold">{book.copies}</span>
              </div>
              {book.copies > 0 && (
                <Button
                  size="lg"
                  onClick={() => navigate(`/borrow/${book._id}`)}
                  className="w-full text-sm sm:text-base"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Borrow This Book
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-sm sm:text-base"
                onClick={() => navigate("/books")}
              >
                <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">View All Books</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-sm sm:text-base"
                onClick={() => navigate(`/books?genre=${book.genre}`)}
              >
                <BookMarked className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">More {book.genre.replace("_", " ")} Books</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-sm sm:text-base"
                onClick={() =>
                  navigate(`/books?author=${encodeURIComponent(book.author)}`)
                }
              >
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">More by {book.author}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-sm sm:text-base"
                onClick={handleShare}
              >
                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Share This Book</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetails;
