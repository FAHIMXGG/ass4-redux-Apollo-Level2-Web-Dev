import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Home, Search, ArrowLeft, BookX } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to books page with search query (if you have search functionality)
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const quickActions = [
    {
      icon: Home,
      label: 'Go Home',
      description: 'Return to the main page',
      action: () => navigate('/'),
      variant: 'default' as const
    },
    {
      icon: BookOpen,
      label: 'Browse Books',
      description: 'Explore our book collection',
      action: () => navigate('/books'),
      variant: 'outline' as const
    },
    {
      icon: ArrowLeft,
      label: 'Go Back',
      description: 'Return to previous page',
      action: () => window.history.back(),
      variant: 'ghost' as const
    }
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto text-center space-y-8 animate-in fade-in-50 duration-700">
        {/* 404 Illustration */}
        <div className="relative animate-in zoom-in-95 duration-1000 delay-200">
          <div className="text-9xl font-bold text-muted-foreground/20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookX className="h-24 w-24 text-muted-foreground/60 animate-pulse" />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <h1 className="text-4xl font-bold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for seems to have been misplaced in our library.
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search for books instead?
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search books, authors, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!searchQuery.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Search Books
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-700">
          <h2 className="text-lg font-semibold text-muted-foreground">
            What would you like to do?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <action.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{action.label}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Still can't find what you're looking for?{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-sm"
              onClick={() => navigate('/books')}
            >
              Browse all books
            </Button>
            {' '}or{' '}
            <Button
              variant="link"
              className="p-0 h-auto font-normal text-sm"
              onClick={() => navigate('/')}
            >
              return to homepage
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound