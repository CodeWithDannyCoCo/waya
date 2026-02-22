import { ChoreList } from "@/components/chore-list"

export default function ChildChoresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Chores</h1>
        <p className="text-muted-foreground">View and complete your assigned chores</p>
      </div>

      <ChoreList />
    </div>
  )
}
