
import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarList } from "@tremor/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const { employees, summaries, tasks } = useApp();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"all" | "lastWeek" | "lastMonth" | "lastYear">("all");

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    if (selectedEmployeeId !== "all") {
      filtered = filtered.filter(task => task.employeeId === selectedEmployeeId);
    }
    
    if (dateRange !== "all") {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "lastWeek":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "lastMonth":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "lastYear":
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      filtered = filtered.filter(task => new Date(task.date) >= startDate);
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  
  const piecesCompletedData = employees.map(employee => {
    const employeeTasks = filteredTasks.filter(task => task.employeeId === employee.id);
    const totalPieces = employeeTasks.reduce((sum, task) => sum + task.piecesCompleted, 0);
    return { name: employee.name, value: totalPieces };
  }).sort((a, b) => b.value - a.value);

  const earningsData = employees.map(employee => {
    const employeeTasks = filteredTasks.filter(task => task.employeeId === employee.id);
    const earnings = employeeTasks.reduce((sum, task) => {
      const pieceRate = task.pieceRate || 0; // Add fallback
      return sum + (task.piecesCompleted * pieceRate);
    }, 0);
    return { name: employee.name, value: earnings };
  }).sort((a, b) => b.value - a.value);

  const paymentStatusData = [
    { 
      name: "Paid", 
      value: filteredTasks.filter(task => task.isPaid).reduce((sum, task) => {
        const pieceRate = task.pieceRate || 0; // Add fallback
        return sum + task.piecesCompleted * pieceRate;
      }, 0)
    },
    { 
      name: "Pending", 
      value: filteredTasks.filter(task => !task.isPaid).reduce((sum, task) => {
        const pieceRate = task.pieceRate || 0; // Add fallback
        return sum + task.piecesCompleted * pieceRate;
      }, 0)
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-tailor-800">{t("reports")}</h1>
        
        <Button className="bg-tailor-600 hover:bg-tailor-700">
          <Download className="mr-2 h-4 w-4" /> Export as XLS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Tabs defaultValue="all" onValueChange={(value) => setDateRange(value as "all" | "lastWeek" | "lastMonth" | "lastYear")}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="lastWeek">Last Week</TabsTrigger>
              <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
              <TabsTrigger value="lastYear">Last Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pieces Completed by Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList data={piecesCompletedData} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Earnings by Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList 
              data={earningsData} 
              className="mt-2"
              valueFormatter={(value) => `₹${value.toLocaleString()}`} 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentStatusData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis
                  tickFormatter={(v) => `₹${v.toLocaleString()}`}
                  width={80}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]}
                  cursor={{ fill: "#f4f7fb" }}
                />
                <Bar dataKey="value" fill="#5272b5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Total Pieces</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Pending Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries
                .filter(s => selectedEmployeeId === "all" || s.employee.id === selectedEmployeeId)
                .map((summary) => (
                  <TableRow key={summary.employee.id}>
                    <TableCell className="font-medium">{summary.employee.name}</TableCell>
                    <TableCell>{summary.totalPieces}</TableCell>
                    <TableCell>₹{summary.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell>₹{summary.paidAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" 
                        className={summary.pendingAmount > 0 ? 
                          "bg-amber-50 text-amber-700 border-amber-200" : 
                          "bg-green-50 text-green-700 border-green-200"}>
                          ₹{summary.pendingAmount.toLocaleString()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
