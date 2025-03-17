"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Edit, Trash2, X } from "lucide-react"
import Link from "next/link"
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

export interface TodoProps {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function Todo({
  id,
  title,
  description,
  completed,
  createdAt,
  onToggleStatus,
  onDelete,
}: TodoProps) {
  return (
    <Card className={completed ? "opacity-75" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className={`${completed ? "line-through text-muted-foreground" : ""}`}>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>Created on {formatDate(createdAt)}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStatus(id)}
            className={completed ? "text-green-500" : "text-muted-foreground"}
            aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {completed ? <Check data-testid="check-icon" /> : <X data-testid="x-icon" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${completed ? "line-through text-muted-foreground" : ""}`}>
          {description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/todos/edit/${id}`}>
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
              <AlertDialogAction onClick={() => onDelete(id)} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
} 