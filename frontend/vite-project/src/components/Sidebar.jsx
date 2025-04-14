// src/components/Sidebar.jsx
import { Home, FileText, List, Settings, SunMoon } from "lucide-react"
import { Button } from "@/components/ui/button"
import DarkModeToggle from "./DarkModeToggle"

export default function Sidebar() {
  return (
    <div className="h-screen w-[220px] bg-background border-r px-4 py-6 flex flex-col justify-between fixed">
      <div>
        <h1 className="text-xl font-bold mb-8">ReconAI</h1>
        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <List className="mr-2 h-4 w-4" /> Transactions
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" /> Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
      </div>
      <DarkModeToggle />
    </div>
  )
}
