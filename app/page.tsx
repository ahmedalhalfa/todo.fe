import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Manage your tasks with ease</h1>
        <p className="text-xl text-muted-foreground max-w-prose mx-auto">
          A simple, intuitive todo application to help you stay organized and productive. Track your tasks, set
          priorities, and never miss a deadline again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/register">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {[
          {
            title: "Simple & Intuitive",
            description: "Easy to use interface that helps you manage tasks without complexity.",
          },
          {
            title: "Track Progress",
            description: "Mark tasks as complete and track your productivity over time.",
          },
          {
            title: "Accessible Anywhere",
            description: "Access your todos from any device with a responsive design.",
          },
        ].map((feature, i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

