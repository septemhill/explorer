import { Blocks } from "@/components/blocks"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
        <ThemeToggle />
      </div>
      <Blocks />
    </div>
  )
}

