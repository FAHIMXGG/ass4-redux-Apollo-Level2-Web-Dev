"use client"

import type React from "react"
import { Heart } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Minimal Library Management System. All rights reserved.
          </p>
          <p className="flex items-center text-xs text-muted-foreground">
            Developed with <Heart className="mx-1 h-3 w-3 fill-red-500 text-red-500" />
            using React, RTK Query, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
