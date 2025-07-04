import type React from "react"
import { Heart, BookOpen, Code2, ExternalLink, Globe2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gradient-to-r from-background via-background/95 to-background backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold">Library Management System</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              A modern, efficient library management solution built with cutting-edge web technologies.
              Manage your book collection, track borrowing, and maintain your library with ease.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="https://github.com/FAHIMXGG/ass4-redux-Apollo-Level2-Web-Dev" target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center">
                  <Code2 className="h-4 w-4" /> View Source 
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="https://fahimx.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center">
                  <Globe2Icon className="h-4 w-4" /> Contact 
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <a href="/books" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Browse Books
              </a>
              <a href="/create-book" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Add New Book
              </a>
              <a href="/borrow-summary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Borrow Summary
              </a>
            </nav>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Built With</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                React & TypeScript
              </span>
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                Redux Toolkit & RTK Query
              </span>
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                Tailwind CSS & shadcn/ui
              </span>
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                Vite & Vercel
              </span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>&copy; {currentYear} Library Management System</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
            <span>for book lovers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
