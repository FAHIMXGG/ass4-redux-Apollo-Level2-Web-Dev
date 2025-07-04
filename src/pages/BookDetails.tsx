"use client";

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
      <div className="w-full max-w-4xl mx-auto p-6">
        <BookCardSkeleton />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Book Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/books")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/books")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Books
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Book Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                {book.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-lg text-muted-foreground">
                <User className="h-5 w-5" />
                <span>by {book.author}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge
                variant={book.available ? "default" : "destructive"}
                className="text-sm px-3 py-1"
              >
                {book.available ? "Available" : "Not Available"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {book.copies} copies available
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Book Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ISBN
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono">{book.isbn}</p>
                    <Button variant="ghost" size="sm" onClick={copyISBN}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BookMarked className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Genre
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {book.genre.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Copy className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Copies
                  </p>
                  <p className="text-lg font-semibold">{book.copies}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Added to Library
                  </p>
                  <p>
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
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(`/edit-book/${book._id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Book
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Book
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Book</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{book.title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Availability Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-semibold">{book.copies}</span>
              </div>
              {book.copies > 0 && (
                <Button
                  size="lg"
                  onClick={() => navigate(`/borrow/${book._id}`)}
                  className="flex-1 w-full"
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
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/books")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View All Books
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/books?genre=${book.genre}`)}
              >
                <BookMarked className="h-4 w-4 mr-2" />
                More {book.genre.replace("_", " ")} Books
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  navigate(`/books?author=${encodeURIComponent(book.author)}`)
                }
              >
                <User className="h-4 w-4 mr-2" />
                More by {book.author}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Share This Book
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetails;
