import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, Grid, TrendingUp } from 'lucide-react';

export const PeriodicTableLesson: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">The Periodic Table</h1>
        <p className="text-lg text-muted-foreground">The Chemist's Map</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              The <strong>periodic table</strong> is a chart that organises all the known chemical elements. It's a brilliant tool 
              that helps us understand how elements are related to one another. The table is laid out in rows (<strong>periods</strong>) 
              and columns (<strong>groups</strong>), and each element's spot tells us a lot about its atomic number, atomic mass, 
              and chemical properties.
            </p>

            <div className="flex items-center justify-center mb-8">
              <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <Grid className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Periodic Table</h3>
                <p className="text-gray-600">118 known elements organized by properties</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-700">Periods (Rows)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Horizontal rows in the table</li>
                    <li>• Elements have same number of electron shells</li>
                    <li>• Properties change across a period</li>
                    <li>• 7 periods in total</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-700">Groups (Columns)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Vertical columns in the table</li>
                    <li>• Elements have similar properties</li>
                    <li>• Same number of valence electrons</li>
                    <li>• 18 groups in total</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">A Moment for a Think:</h4>
          <p>
            Look up the periodic table and find the element "Helium." What's its symbol, atomic number, and atomic mass? 
            What group is it in?
          </p>
        </AlertDescription>
      </Alert>

      <Alert className="border-green-200 bg-green-50">
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <h4 className="font-bold mb-2">Deeper Dive: Trends on the Table</h4>
          <p>
            The periodic table isn't just a list; it's a map of <strong>chemical trends</strong>. For example, elements in the same 
            column (group) tend to have similar chemical properties because they have the same number of valence electrons (electrons 
            in the outermost shell). Elements get more metallic as you go down and to the left of the table. Understanding these trends 
            is key to predicting how elements will react with each other.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Common Element Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">Group 1</div>
              <div>
                <h4 className="font-semibold">Alkali Metals</h4>
                <p className="text-sm text-muted-foreground">Very reactive metals (like sodium, potassium)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">Group 17</div>
              <div>
                <h4 className="font-semibold">Halogens</h4>
                <p className="text-sm text-muted-foreground">Highly reactive non-metals (like fluorine, chlorine)</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">Group 18</div>
              <div>
                <h4 className="font-semibold">Noble Gases</h4>
                <p className="text-sm text-muted-foreground">Very stable, rarely react (like helium, neon)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Key Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Periodic Table</h4>
              <p className="text-sm text-muted-foreground">A chart of all the known chemical elements.</p>
            </div>
            <div>
              <h4 className="font-semibold">Group</h4>
              <p className="text-sm text-muted-foreground">A column in the periodic table.</p>
            </div>
            <div>
              <h4 className="font-semibold">Period</h4>
              <p className="text-sm text-muted-foreground">A row in the periodic table.</p>
            </div>
            <div>
              <h4 className="font-semibold">Valence Electrons</h4>
              <p className="text-sm text-muted-foreground">Electrons in the outermost shell.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};