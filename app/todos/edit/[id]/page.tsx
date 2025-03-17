"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { todoApi } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const todoSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  completed: z.boolean().default(false),
})

type TodoFormValues = z.infer<typeof todoSchema>

export default function EditTodoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
  })

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setIsLoading(true)
        const todo = await todoApi.getById(params.id)

        form.reset({
          title: todo.title,
          description: todo.description || "",
          completed: todo.completed,
        })
      } catch (error) {
        console.error("Failed to fetch todo:", error)

        toast({
          title: "Error",
          description: "Failed to load todo. Redirecting to dashboard.",
          variant: "destructive",
        })

        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodo()
  }, [params.id, form, router])

  async function onSubmit(data: TodoFormValues) {
    setIsSubmitting(true)
    try {
      await todoApi.update(params.id, data)

      toast({
        title: "Todo updated",
        description: "Your todo has been updated successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to update todo:", error)

      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-10">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Todo</h1>
          <p className="text-muted-foreground">Update your todo details</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter todo title" {...field} />
                  </FormControl>
                  <FormDescription>A short, descriptive title for your todo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a detailed description (optional)" className="min-h-32" {...field} />
                  </FormControl>
                  <FormDescription>Provide additional details about this todo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as completed</FormLabel>
                    <FormDescription>Check this if the todo is completed.</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Todo
              </Button>

              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

