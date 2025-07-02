import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const icon =
    theme === "dark" ? (
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    ) : (
      <Sun className="h-[1.2rem] w-[1.2rem]" />
    )

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={`Current theme: ${theme}. Click to toggle.`}
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
