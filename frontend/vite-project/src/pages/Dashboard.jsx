// // src/components/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from "../components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from "../components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { AlertCircle, BadgeCheck, CircleAlert } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";

// export default function Dashboard() {
//   const [results, setResults] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8000/transactions?access_token=access-sandbox-8d595fc7-05a7-4ca3-ad21-d8368bbac912")
//       .then(res => res.json())
//       .then(transactions => {
//         fetch("http://localhost:8000/reconcile", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(transactions)
//         })
//           .then(res => res.json())
//           .then(data => setResults(data))
//           .catch(console.error);
//       })
//       .catch(console.error);
//   }, []);

//   if (!results) return <p className="text-center mt-20 text-muted">Loading...</p>;

//   const { matches, unmatched_transactions } = results;

//   const pieData = [
//     { name: "Matched", value: matches.length },
//     { name: "Unmatched", value: unmatched_transactions.length }
//   ];

//   const lineData = matches.map((m, index) => ({
//     name: `#${index + 1}`,
//     score: m.score
//   }));

//   const COLORS = ["#4ade80", "#f97316"];

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">ReconAI Dashboard</h1>
//       <Tabs defaultValue="overview">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="comparison">Comparison</TabsTrigger>
//           <TabsTrigger value="details">Details</TabsTrigger>
//         </TabsList>
//         <TabsContent value="overview">
//           <div className="grid grid-cols-4 gap-4 my-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Total Transactions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-semibold">{matches.length + unmatched_transactions.length}</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Matched</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-semibold text-green-600">{matches.length}</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Unmatched</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-semibold text-yellow-500">{unmatched_transactions.length}</p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Accuracy</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-2xl font-semibold">
//                   {((matches.length / (matches.length + unmatched_transactions.length)) * 100).toFixed(2)}%
//                 </p>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Match Score Trends</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <LineChart data={lineData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis domain={[0, 1]} />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Transaction Split</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         <TabsContent value="details">
//           <Card className="my-4">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-green-600">
//                 <BadgeCheck className="w-5 h-5" /> Matched Transactions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Transaction ID</TableHead>
//                     <TableHead>Invoice ID</TableHead>
//                     <TableHead>Score</TableHead>
//                     <TableHead>Amount Diff</TableHead>
//                     <TableHead>Date Diff</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {matches.map(match => (
//                     <TableRow key={match.transaction_id}>
//                       <TableCell>{match.transaction_id}</TableCell>
//                       <TableCell>{match.invoice_id}</TableCell>
//                       <TableCell>{match.score}</TableCell>
//                       <TableCell>{match.amount_difference}</TableCell>
//                       <TableCell>{match.date_difference}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>

//           <Card className="my-4">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-yellow-500">
//                 <AlertCircle className="w-5 h-5" /> Unmatched Transactions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="list-disc list-inside text-sm">
//                 {unmatched_transactions.map(tx => (
//                   <li key={tx.transaction_id}>
//                     <strong>{tx.name}</strong> — ${tx.amount} on {tx.date}
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


"use client"

import { useEffect, useState } from "react"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Calendar,
  ChevronDown,
  CircleAlert,
  Clock,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  LineChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sliders,
} from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate, Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function Dashboard() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const navigate = useNavigate();


  useEffect(() => {
    const accessToken = localStorage.getItem("teller_access_token")
    if (!accessToken) return console.error("No Teller token found")
  
    setLoading(true)
    fetch(`http://localhost:8000/transactions?access_token=${accessToken}`)
      .then((res) => res.json())
      .then((transactions) => {
        fetch("http://localhost:8000/reconcile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactions),
        })
          .then((res) => res.json())
          .then((data) => {
            setResults(data)
            setLoading(false)
          })
          .catch((error) => {
            console.error(error)
            setLoading(false)
          })
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])
  

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <CircleAlert className="h-5 w-5" /> Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Unable to load dashboard data. Please check your connection and try again.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { matches, unmatched_transactions } = results

  // Generate monthly data for the bar chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2023, i, 1).toLocaleString("default", { month: "short" })
    return {
      name: month,
      matched: Math.floor(Math.random() * 50) + 30,
      unmatched: Math.floor(Math.random() * 20) + 5,
    }
  })

  const pieData = [
    { name: "Matched", value: matches.length, color: "hsl(var(--primary))" },
    { name: "Unmatched", value: unmatched_transactions.length, color: "hsl(var(--muted))" },
  ]

  const lineData = matches.map((m, index) => ({
    name: `#${index + 1}`,
    score: m.score,
  }))

  const totalTransactions = matches.length + unmatched_transactions.length
  const matchPercentage = (matches.length / totalTransactions) * 100
  const unmatchedPercentage = (unmatched_transactions.length / totalTransactions) * 100

  // Generate some fake recent activity data
  const recentActivity = [
    { type: "match", id: "TR-9385", time: "2 minutes ago", score: 0.95 },
    { type: "unmatch", id: "TR-8294", time: "15 minutes ago", reason: "Amount mismatch" },
    { type: "match", id: "TR-7392", time: "32 minutes ago", score: 0.87 },
    { type: "system", id: "SYS-1234", time: "1 hour ago", message: "Daily reconciliation completed" },
    { type: "match", id: "TR-6281", time: "2 hours ago", score: 0.92 },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar and main content layout */}
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="hidden border-r bg-muted/10 md:block">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Activity className="h-4 w-4" />
                </div>
                <span>ReconAI</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Button variant="ghost" className="flex justify-start gap-2 font-normal">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 font-normal text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 font-normal text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Reports
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 font-normal text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>

                <Separator className="my-4" />

                <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground">Transactions</h3>
                <Button variant="ghost" className="flex justify-start gap-2 font-normal text-muted-foreground">
                  <BadgeCheck className="h-4 w-4" />
                  Matched
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 font-normal text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Unmatched
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 font-normal text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Pending
                </Button>
              </nav>
            </div>
            <div className="mt-auto border-t p-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 text-xs">
                  <div className="font-medium">John Doe</div>
                  <div className="text-muted-foreground">john@example.com</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Custom"}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeRange("7d")}>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("30d")}>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("90d")}>Last 90 days</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Custom range</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Refresh</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("teller_access_token")
                    navigate("/login")
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="flex flex-col gap-6">
              {/* Page header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor your transaction reconciliation metrics and performance.
                </p>
              </div>

              {/* Stats cards */}
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <Card
                  onClick={() => 
                    navigate("/transactions", {
                      state: {transactions: [...matches, ...unmatched_transactions]},
                    })
                  }
                  className="cursor-pointer transition hover:scale-[1.01]"
                > 
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <div className="rounded-md bg-primary/10 p-1 text-primary">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTransactions}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-primary">↑ 12%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${matchPercentage}%` }}></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>{matches.length} matched</span>
                      <span>{unmatched_transactions.length} unmatched</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
                    <div className="rounded-md bg-primary/10 p-1 text-primary">
                      <BadgeCheck className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{matchPercentage.toFixed(1)}%</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-primary">↑ 4.3%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                    <Progress value={matchPercentage} className="mt-3 h-1.5" />
                    <div className="mt-1 text-xs text-muted-foreground">
                      {matches.length} out of {totalTransactions} transactions
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <div className="rounded-md bg-primary/10 p-1 text-primary">
                      <LineChart className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(matches.reduce((acc, match) => acc + match.score, 0) / matches.length).toFixed(3)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-primary">↑ 1.2%</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? "bg-primary" : "bg-muted"}`}></div>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Based on {matches.length} matches</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
                    <div className="rounded-md bg-primary/10 p-1 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="text-primary">↓ 0.3s</span>
                      <span className="ml-1">from previous period</span>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 rounded-md bg-primary/10"
                          style={{ height: `${Math.max(15, Math.random() * 30)}px` }}
                        ></div>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Last 7 days average</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts section */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="md:col-span-4">
                  <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-1">
                      <CardTitle>Monthly Transactions</CardTitle>
                      <CardDescription>Transaction volume by month</CardDescription>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Select defaultValue="volume">
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="volume">Volume</SelectItem>
                          <SelectItem value="rate">Match Rate</SelectItem>
                          <SelectItem value="score">Match Score</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Sliders className="h-4 w-4" />
                        <span className="sr-only">Adjust</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                          <RechartsTooltip
                            cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid gap-1">
                                      <div className="font-medium">{label}</div>
                                      {payload.map((entry, index) => (
                                        <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
                                          <div
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                          />
                                          <span>{entry.name}: </span>
                                          <span className="font-medium">{entry.value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar
                            dataKey="matched"
                            stackId="a"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            name="Matched"
                          />
                          <Bar
                            dataKey="unmatched"
                            stackId="a"
                            fill="hsl(var(--muted))"
                            radius={[4, 4, 0, 0]}
                            name="Unmatched"
                          />
                          <Legend
                            verticalAlign="top"
                            height={36}
                            content={({ payload }) => {
                              return (
                                <div className="flex justify-center gap-4">
                                  {payload.map((entry, index) => (
                                    <div key={`item-${index}`} className="flex items-center gap-1 text-sm">
                                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                      <span>{entry.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )
                            }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Match Score Distribution</CardTitle>
                    <CardDescription>Confidence scores for matched transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <YAxis
                            domain={[0, 1]}
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toFixed(1)}
                          />
                          <RechartsTooltip
                            cursor={{ stroke: "hsl(var(--muted))" }}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid gap-1">
                                      <div className="font-medium">Transaction {label}</div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <span>Score: </span>
                                        <span className="font-medium">{payload[0].value.toFixed(3)}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent activity and pie chart */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="md:col-span-4">
                  <CardHeader className="flex flex-row items-center">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest transaction events</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-8">
                        {recentActivity.map((activity, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="relative mt-0.5">
                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                  activity.type === "match"
                                    ? "bg-primary/10 text-primary"
                                    : activity.type === "unmatch"
                                      ? "bg-destructive/10 text-destructive"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {activity.type === "match" ? (
                                  <BadgeCheck className="h-5 w-5" />
                                ) : activity.type === "unmatch" ? (
                                  <AlertCircle className="h-5 w-5" />
                                ) : (
                                  <RefreshCw className="h-5 w-5" />
                                )}
                              </div>
                              {i < recentActivity.length - 1 && (
                                <div className="absolute bottom-0 left-1/2 top-10 w-px -translate-x-1/2 bg-border" />
                              )}
                            </div>
                            <div className="grid gap-1">
                              <div className="font-medium">
                                {activity.type === "match"
                                  ? `Transaction ${activity.id} matched`
                                  : activity.type === "unmatch"
                                    ? `Transaction ${activity.id} failed to match`
                                    : activity.message}
                              </div>
                              <div className="text-sm text-muted-foreground">{activity.time}</div>
                              {activity.type === "match" && (
                                <div className="mt-1 flex items-center gap-2">
                                  <Progress value={activity.score * 100} className="h-1.5 w-20" />
                                  <span className="text-xs">Score: {activity.score.toFixed(3)}</span>
                                </div>
                              )}
                              {activity.type === "unmatch" && (
                                <div className="mt-1 text-xs text-muted-foreground">Reason: {activity.reason}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3">
                    <Button variant="outline" className="w-full gap-1">
                      <span>View all activity</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Transaction Split</CardTitle>
                    <CardDescription>Distribution of matched vs unmatched transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid gap-1">
                                      <div className="font-medium">{payload[0].name}</div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <span>Count: </span>
                                        <span className="font-medium">{payload[0].value}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <span>Percentage: </span>
                                        <span className="font-medium">
                                          {((payload[0].value / totalTransactions) * 100).toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex gap-6">
                      {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{entry.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {entry.value} ({((entry.value / totalTransactions) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3">
                    <Button variant="outline" size="sm" className="w-full">
                      View detailed breakdown
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Transactions table */}
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Recent matched and unmatched transactions</CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Filter</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                    </Button>
                    <Button size="sm" className="h-8 gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.slice(0, 5).map((match, index) => (
                        <TableRow key={match.transaction_id}>
                          <TableCell className="font-medium">{match.transaction_id}</TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell>Invoice #{match.invoice_id}</TableCell>
                          <TableCell>${(Math.random() * 1000 + 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Matched
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={match.score * 100} className="h-1.5 w-16" />
                              <span className="text-xs">{match.score.toFixed(3)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {unmatched_transactions.slice(0, 2).map((tx, index) => (
                        <TableRow key={tx.transaction_id}>
                          <TableCell className="font-medium">{tx.transaction_id}</TableCell>
                          <TableCell>{tx.date}</TableCell>
                          <TableCell>{tx.name}</TableCell>
                          <TableCell>${tx.amount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-destructive/10 text-destructive">
                              Unmatched
                            </Badge>
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>7</strong> of <strong>{totalTransactions}</strong> transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function Menu({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function MoreHorizontal({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
