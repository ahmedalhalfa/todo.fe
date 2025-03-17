"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Todo, todoApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-provider"
import { Check, Edit, Plus, Search, Trash2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
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
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  console.log("Dashboard page loaded, user:", user)

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {
    filterTodos()
  }, [todos, searchQuery, activeTab])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const data = await todoApi.getAll()
      setTodos(data)
    } catch (error) {
      console.error("Failed to fetch todos:", error)
      toast({
        title: "Error",
        description: "Failed to load your todos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTodos = () => {
    let filtered = [...todos]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by completion status
    if (activeTab === "completed") {
      filtered = filtered.filter((todo) => todo.completed)
    } else if (activeTab === "active") {
      filtered = filtered.filter((todo) => !todo.completed)
    }

    setFilteredTodos(filtered)
  }

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      const updatedTodo = await todoApi.update(todo._id, {
        completed: !todo.completed,
      })

      setTodos(todos.map((t) => (t._id === todo._id ? updatedTodo : t)))

      toast({
        title: updatedTodo.completed ? "Todo completed" : "Todo marked as active",
        description: updatedTodo.title,
      })
    } catch (error) {
      console.error("Failed to update todo status:", error)
      toast({
        title: "Error",
        description: "Failed to update todo status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id)
      setTodos(todos.filter((todo) => todo._id !== id))

      toast({
        title: "Todo deleted",
        description: "The todo has been deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete todo:", error)
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName || user?.email.split("@")[0]}</p>
        </div>
        <Button asChild>
          <Link href="/todos/create">
            <Plus className="mr-2 h-4 w-4" /> New Todo
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search todos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map((todo) => (
            <Card key={todo._id} className={todo.completed ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                    <CardTitle className="text-xl">{todo.title}</CardTitle>
                    <CardDescription>Created on {formatDate(todo.createdAt)}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTodoStatus(todo)}
                    className={todo.completed ? "text-green-500" : "text-muted-foreground"}
                  >
                    {todo.completed ? <Check /> : <X />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                  {todo.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/todos/edit/${todo._id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the todo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTodo(todo._id)} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Check className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-1">No todos found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {searchQuery
              ? "No todos match your search criteria. Try a different search term."
              : activeTab !== "all"
                ? `You don't have any ${activeTab} todos.`
                : "You don't have any todos yet. Create your first todo to get started."}
          </p>
          <Button asChild>
            <Link href="/todos/create">
              <Plus className="mr-2 h-4 w-4" /> Create Todo
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

