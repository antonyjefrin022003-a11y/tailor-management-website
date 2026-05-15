
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarList } from "@tremor/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 360, damping: 24 } },
};

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const { employees, summaries, tasks } = useApp();
  const navigate = useNavigate();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"all" | "lastWeek" | "lastMonth" | "lastYear">("all");

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    if (selectedEmployeeId !== "all") filtered = filtered.filter(t => t.employeeId === selectedEmployeeId);
    if (dateRange !== "all") {
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case "lastWeek": startDate = new Date(now); startDate.setDate(now.getDate() - 7); break;
        case "lastMonth": startDate = new Date(now); startDate.setMonth(now.getMonth() - 1); break;
        case "lastYear": startDate = new Date(now); startDate.setFullYear(now.getFullYear() - 1); break;
        default: startDate = new Date(0);
      }
      filtered = filtered.filter(t => new Date(t.date) >= startDate);
    }
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const piecesCompletedData = employees.map(e => ({
    name: e.name,
    value: filteredTasks.filter(t => t.employeeId === e.id).reduce((s, t) => s + t.piecesCompleted, 0),
  })).sort((a, b) => b.value - a.value);

  const earningsData = employees.map(e => ({
    name: e.name,
    value: filteredTasks.filter(t => t.employeeId === e.id).reduce((s, t) => s + t.piecesCompleted * (t.pieceRate || 0), 0),
  })).sort((a, b) => b.value - a.value);

  const paymentStatusData = [
    { name: "Paid", value: filteredTasks.filter(t => t.isPaid).reduce((s, t) => s + t.piecesCompleted * (t.pieceRate || 0), 0) },
    { name: "Pending", value: filteredTasks.filter(t => !t.isPaid).reduce((s, t) => s + t.piecesCompleted * (t.pieceRate || 0), 0) },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h1 className="text-2xl font-bold text-tailor-800 dark:text-tailor-200">{t("reports")}</h1>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button className="bg-tailor-600 hover:bg-tailor-700">
            <Download className="mr-2 h-4 w-4" /> Export as XLS
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs defaultValue="all" onValueChange={(v) => setDateRange(v as "all" | "lastWeek" | "lastMonth" | "lastYear")}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="lastWeek">Last Week</TabsTrigger>
            <TabsTrigger value="lastMonth">Last Month</TabsTrigger>
            <TabsTrigger value="lastYear">Last Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={cardItem}>
          <Card className="transition-theme">
            <CardHeader><CardTitle>Pieces Completed by Employee</CardTitle></CardHeader>
            <CardContent><BarList data={piecesCompletedData} className="mt-2" /></CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardItem}>
          <Card className="transition-theme">
            <CardHeader><CardTitle>Earnings by Employee</CardTitle></CardHeader>
            <CardContent>
              <BarList
                data={earningsData}
                className="mt-2"
                valueFormatter={(v) => `₹${v.toLocaleString()}`}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, type: "spring", stiffness: 300, damping: 24 }}
      >
        <Card className="transition-theme">
          <CardHeader><CardTitle>Payment Status Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentStatusData} barSize={60}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "currentColor" }} />
                  <YAxis tickFormatter={(v) => `₹${v.toLocaleString()}`} width={80} tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Amount"]} cursor={{ fill: "rgba(82,114,181,0.08)" }} />
                  <Bar dataKey="value" fill="#5272b5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 24 }}
      >
        <Card className="transition-theme">
          <CardHeader><CardTitle>Detailed Report</CardTitle></CardHeader>
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
                    <TableRow key={summary.employee.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <motion.button
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 22 }}
                          className="text-tailor-700 dark:text-tailor-300 hover:underline text-left"
                          onClick={() => navigate(`/employees/${summary.employee.id}`)}
                        >
                          {summary.employee.name}
                        </motion.button>
                      </TableCell>
                      <TableCell>{summary.totalPieces}</TableCell>
                      <TableCell>₹{summary.totalEarnings.toLocaleString()}</TableCell>
                      <TableCell>₹{summary.paidAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={summary.pendingAmount > 0
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                            : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          }
                        >
                          ₹{summary.pendingAmount.toLocaleString()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;
