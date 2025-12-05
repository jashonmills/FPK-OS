import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Trophy, Gamepad2, PlusCircle, Store, Settings } from "lucide-react";

// --- ADVANCED MOCK DATA & COMPONENTS ---
const mockLeaderboard = [
  { rank: 1, name: "Fionn Boyle", points: 1250, avatar: "https://avatar.vercel.sh/fionn.png" },
  { rank: 2, name: "Sarah Johnson", points: 1100, avatar: "https://avatar.vercel.sh/sarah.png" },
  { rank: 3, name: "David Chen", points: 980, avatar: "https://avatar.vercel.sh/david.png" },
];

const mockBadges = [
  { name: "Perfect Attendance", description: "Awarded for 20 consecutive days of attendance.", trigger: "Auto", points: 500 },
  { name: "Homework Hero", description: "5 assignments in a row with a grade >90%.", trigger: "Auto", points: 250 },
  { name: "Community Helper", description: "Manually awarded for helping others.", trigger: "Manual", points: 100 },
];

const mockStoreItems = [
  { name: "Fancy Pen", cost: 500, stock: 50 },
  { name: "DJ for a Day at Lunch", cost: 2000, stock: 1 },
  { name: "School Hoodie", cost: 5000, stock: 10 },
];

export const GamificationPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Engagement Design Studio</h1>
        <p className="text-slate-500 mt-1">
          Design and manage a system that motivates students and rewards positive behavior.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-200/60 p-1 h-auto">
          <TabsTrigger value="dashboard" className="py-2 text-sm">
            <Trophy className="h-4 w-4 mr-2" />
            Live Dashboard
          </TabsTrigger>
          <TabsTrigger value="designer" className="py-2 text-sm">
            <Settings className="h-4 w-4 mr-2" />
            Achievement Designer
          </TabsTrigger>
          <TabsTrigger value="store" className="py-2 text-sm">
            <Store className="h-4 w-4 mr-2" />
            School Store & Rewards
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Live Dashboard */}
        <TabsContent value="dashboard" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Overall Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaderboard.map((s) => (
                    <TableRow key={s.rank}>
                      <TableCell className="font-bold">{s.rank}</TableCell>
                      <TableCell className="font-medium flex items-center gap-3">
                        <img src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full" />
                        {s.name}
                      </TableCell>
                      <TableCell>{s.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Gamepad2 className="text-green-500" />
                <p className="text-sm">Sarah J. earned 'Homework Hero'</p>
              </div>
              <div className="flex items-center gap-3">
                <Gamepad2 className="text-blue-500" />
                <p className="text-sm">Fionn B. earned 'Perfect Attendance'</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Achievement Designer */}
        <TabsContent value="designer" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Badge & Achievement Rules</CardTitle>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Badge
                </Button>
              </div>
              <CardDescription>
                Define the badges students can earn and the rules that trigger them automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Badge</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBadges.map((b) => (
                    <TableRow key={b.name}>
                      <TableCell className="font-semibold">{b.name}</TableCell>
                      <TableCell>{b.description}</TableCell>
                      <TableCell>
                        <Badge variant={b.trigger === "Auto" ? "default" : "secondary"}>{b.trigger}</Badge>
                      </TableCell>
                      <TableCell>{b.points}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: School Store */}
        <TabsContent value="store" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rewards Store Management</CardTitle>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Item
                </Button>
              </div>
              <CardDescription>
                Manage the items students can purchase with their earned points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Cost (Points)</TableHead>
                    <TableHead>Stock Remaining</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStoreItems.map((i) => (
                    <TableRow key={i.name}>
                      <TableCell className="font-semibold">{i.name}</TableCell>
                      <TableCell>{i.cost}</TableCell>
                      <TableCell>{i.stock}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
