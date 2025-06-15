"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const bloodPressureData = [
  { date: "May 22", systolic: 120, diastolic: 80 },
  { date: "May 23", systolic: 118, diastolic: 78 },
  { date: "May 24", systolic: 122, diastolic: 82 },
  { date: "May 25", systolic: 125, diastolic: 85 },
  { date: "May 26", systolic: 119, diastolic: 79 },
  { date: "May 27", systolic: 121, diastolic: 81 },
  { date: "May 28", systolic: 118, diastolic: 78 },
];

const bloodSugarData = [
  { date: "May 22", level: 95 },
  { date: "May 23", level: 100 },
  { date: "May 24", level: 92 },
  { date: "May 25", level: 98 },
  { date: "May 26", level: 105 },
  { date: "May 27", level: 97 },
  { date: "May 28", level: 94 },
];

const weightData = [
  { date: "May 22", weight: 165 },
  { date: "May 23", weight: 164.5 },
  { date: "May 24", weight: 164 },
  { date: "May 25", weight: 163.5 },
  { date: "May 26", weight: 163 },
  { date: "May 27", weight: 162.5 },
  { date: "May 28", weight: 162 },
];

export function HealthMetricsChart() {
  return (
    <Tabs defaultValue="blood-pressure" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
        <TabsTrigger value="blood-sugar">Blood Sugar</TabsTrigger>
        <TabsTrigger value="weight">Weight</TabsTrigger>
      </TabsList>
      
      <TabsContent value="blood-pressure">
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bloodPressureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[60, 140]} />
              <Tooltip />
              <Line
                dataKey="systolic"
                stroke="#ef4444"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                dataKey="diastolic"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Systolic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Diastolic</span>
            </div>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="blood-sugar">
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bloodSugarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[80, 120]} />
              <Tooltip />
              <Line
                dataKey="level"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm">Blood Sugar (mg/dL)</span>
            </div>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="weight">
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[160, 170]} />
              <Tooltip />
              <Line
                dataKey="weight"
                stroke="#8b5cf6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Weight (lbs)</span>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
