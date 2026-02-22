import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, we would check authentication here
  // For now, we'll just redirect to the child dashboard
  redirect("/dashboard/child")
}
