import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with theme toggle */}
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Library Management System</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome to Your Library
            </h2>
            <p className="text-xl text-muted-foreground">
              Manage your books, track loans, and organize your collection with ease.
            </p>
          </div>

          {/* Demo counter with shadcn/ui Button */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>
                Try the theme toggle in the header to see dark/light mode in action!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCount(count - 1)}
                  disabled={count <= 0}
                >
                  Decrease
                </Button>
                <span className="text-2xl font-mono bg-muted px-4 py-2 rounded">
                  {count}
                </span>
                <Button onClick={() => setCount(count + 1)}>
                  Increase
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📚 Book Management</CardTitle>
                <CardDescription>
                  Add, edit, and organize your book collection
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">👥 User System</CardTitle>
                <CardDescription>
                  Manage library members and their accounts
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Analytics</CardTitle>
                <CardDescription>
                  Track loans, returns, and library statistics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
