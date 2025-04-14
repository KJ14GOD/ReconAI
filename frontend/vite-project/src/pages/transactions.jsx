"use client"

import { useState, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  ChevronDown,
  Calendar,
  CreditCard,
  BarChart4,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wallet,
  Info,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionList() {
  const navigate = useNavigate()
  const location = useLocation()
  const transactions = location.state?.transactions || []

  const downloadCSV = (data, filename = "transactions_report.csv") => {
    const headers = ["transaction_id", "name", "amount", "date", "category", "status", "score"]
    const csvContent = [
      headers.join(","),
      ...data.map(tx =>
        [
          tx.transaction_id,
          tx.name,
          tx.amount,
          tx.date,
          tx.category?.[0] || "uncategorized",
          tx.score ? "matched" : "unmatched",
          tx.score ?? ""
        ].join(",")
      )
    ].join("\n")
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  

  // State for UI controls
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
    const matchedTxs = transactions.filter((tx) => tx.score)
    const unmatchedTxs = transactions.filter((tx) => !tx.score)
    const matchRate = transactions.length ? (matchedTxs.length / transactions.length) * 100 : 0

    // Get categories and their counts
    const categories = {}
    transactions.forEach((tx) => {
      const category = tx.category?.[0] || "Uncategorized"
      categories[category] = (categories[category] || 0) + 1
    })

    // Get top categories
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return {
      total: transactions.length,
      totalAmount,
      matchedCount: matchedTxs.length,
      unmatchedCount: unmatchedTxs.length,
      matchRate,
      avgAmount: transactions.length ? totalAmount / transactions.length : 0,
      topCategories,
    }
  }, [transactions])

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const searchableFields = [tx.transaction_id, tx.name, tx.category?.[0], tx.amount?.toString()].filter(Boolean)

          if (!searchableFields.some((field) => field.toLowerCase().includes(query))) {
            return false
          }
        }

        // Status filter
        if (statusFilter === "matched" && !tx.score) return false
        if (statusFilter === "unmatched" && tx.score) return false

        // Time range filter
        if (timeRange !== "all" && tx.date) {
          const txDate = new Date(tx.date)
          const now = new Date()

          if (timeRange === "today") {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (txDate < today) return false
          } else if (timeRange === "week") {
            const weekAgo = new Date()
            weekAgo.setDate(now.getDate() - 7)
            if (txDate < weekAgo) return false
          } else if (timeRange === "month") {
            const monthAgo = new Date()
            monthAgo.setMonth(now.getMonth() - 1)
            if (txDate < monthAgo) return false
          }
        }

        return true
      })
      .sort((a, b) => {
        const { key, direction } = sortConfig

        // Handle different data types
        if (key === "date") {
          return direction === "asc"
            ? new Date(a.date || 0) - new Date(b.date || 0)
            : new Date(b.date || 0) - new Date(a.date || 0)
        }

        if (key === "amount") {
          return direction === "asc"
            ? Number(a.amount || 0) - Number(b.amount || 0)
            : Number(b.amount || 0) - Number(a.amount || 0)
        }

        // Default string comparison
        const aValue = a[key] || ""
        const bValue = b[key] || ""
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      })
  }, [transactions, searchQuery, statusFilter, timeRange, sortConfig])

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTransactions, currentPage, itemsPerPage])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage))

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Transactions</h1>
              <p className="text-sm text-muted-foreground">View and manage your transaction history</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Report</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => downloadCSV(filteredTransactions)}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setTimeRange("all")}>All time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("week")}>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("month")}>Last 30 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl space-y-6 px-6">
          {/* Stats overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Transactions</CardDescription>
                <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{stats.matchedCount} matched</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-600">
                    <XCircle className="h-4 w-4" />
                    <span>{stats.unmatchedCount} unmatched</span>
                  </div>
                </div>
                <Progress value={stats.matchRate} className="mt-3 h-2" indicatorClassName="bg-emerald-600" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Value</CardDescription>
                <CardTitle className="text-3xl font-bold">{formatCurrency(stats.totalAmount)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span>Average: {formatCurrency(stats.avgAmount)}</span>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-sm bg-primary/10"
                      style={{ height: `${Math.max(15, Math.random() * 30)}px` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Match Rate</CardDescription>
                <CardTitle className="text-3xl font-bold">{stats.matchRate.toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart4 className="h-4 w-4" />
                  <span>
                    {stats.matchedCount} of {stats.total} transactions
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="h-2 flex-1 rounded-full bg-emerald-100">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${stats.matchRate}%` }} />
                  </div>
                  <span className="text-xs font-medium">{stats.matchRate.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Top Categories</CardDescription>
                <CardTitle className="text-3xl font-bold">{stats.topCategories[0]?.name || "—"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topCategories.map((category, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{category.name}</span>
                      <Badge variant={i === 0 ? "default" : "outline"}>{category.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, description, amount..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Tabs
                defaultValue="all"
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="matched">Matched</TabsTrigger>
                  <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px] gap-1">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions table */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="border-b bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </div>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            {filteredTransactions.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center gap-2 p-6 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setTimeRange("all")
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="bg-muted/30 sticky top-0">
                    <TableRow>
                      <TableHead className="w-[60px]">#</TableHead>
                      <TableHead className="w-[140px]">
                        <Button
                          variant="ghost"
                          className="flex h-8 items-center gap-1 p-0 font-medium"
                          onClick={() => handleSort("transaction_id")}
                        >
                          ID
                          {sortConfig.key === "transaction_id" && (
                            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[120px]">
                        <Button
                          variant="ghost"
                          className="flex h-8 items-center gap-1 p-0 font-medium"
                          onClick={() => handleSort("date")}
                        >
                          Date
                          {sortConfig.key === "date" && <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />}
                        </Button>
                      </TableHead>
                      <TableHead className="min-w-[240px]">Description</TableHead>
                      <TableHead className="w-[120px]">
                        <Button
                          variant="ghost"
                          className="flex h-8 items-center gap-1 p-0 font-medium"
                          onClick={() => handleSort("amount")}
                        >
                          Amount
                          {sortConfig.key === "amount" && <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((tx, index) => {
                      const rowNumber = (currentPage - 1) * itemsPerPage + index + 1

                      return (
                        <TableRow
                          key={tx.transaction_id || index}
                          className="group cursor-pointer transition-colors hover:bg-muted/50"
                          onClick={() => console.log("Transaction details:", tx)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">{rowNumber}</TableCell>
                          <TableCell className="font-medium">{tx.transaction_id || `TX-${rowNumber}`}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDate(tx.date)}</span>
                              <span className="text-xs text-muted-foreground">
                                <Clock className="mr-1 inline-block h-3 w-3" />
                                {new Date(tx.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 rounded-md bg-primary/10">
                                <AvatarFallback className="rounded-md text-xs">
                                  <CreditCard className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="max-w-[200px] truncate font-medium">{tx.name || "Transaction"}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-medium ${Number(tx.amount) < 0 ? "text-rose-600" : ""}`}>
                              {formatCurrency(tx.amount || 0)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary/20 bg-primary/5">
                              {tx.category?.[0] || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {tx.score ? (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-50 text-emerald-700">Matched</Badge>
                                {tx.score && (
                                  <div className="flex items-center gap-1">
                                    <Progress
                                      value={Number(tx.score) * 100}
                                      className="h-1.5 w-12"
                                      indicatorClassName="bg-emerald-600"
                                    />
                                    <span className="text-xs text-muted-foreground">{Number(tx.score).toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge className="bg-rose-50 text-rose-700">Unmatched</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}

            <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)}-
                {Math.min(filteredTransactions.length, currentPage * itemsPerPage)} of {filteredTransactions.length}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium">{currentPage}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-muted-foreground">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
