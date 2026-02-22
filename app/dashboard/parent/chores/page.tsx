import { ChoreManagement } from "@/components/chore-management"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateChoreDialog } from "@/components/create-chore-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ParentChoresPage() {
  // Mock data for chore statistics
  const choreStats = {
    total: 18,
    completed: 7,
    pending: 11,
    overdue: 2,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chore Management</h1>
          <p className="text-muted-foreground">Create, assign, and manage chores for your children</p>
        </div>
        <CreateChoreDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Chore
          </Button>
        </CreateChoreDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Chores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{choreStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{choreStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{choreStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{choreStats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Chores</TabsTrigger>
          <TabsTrigger value="alex">Alex's Chores</TabsTrigger>
          <TabsTrigger value="jamie">Jamie's Chores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ChoreManagement />
        </TabsContent>

        <TabsContent value="alex" className="mt-6">
          <ChoreManagement />
        </TabsContent>

        <TabsContent value="jamie" className="mt-6">
          <ChoreManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
