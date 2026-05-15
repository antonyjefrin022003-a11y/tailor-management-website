
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle, Calendar } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const row = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 28 } },
};

const Payments: React.FC = () => {
  const { t } = useLanguage();
  const { employees, tasks, updatePaymentStatus } = useApp();
  const [paymentStatus, setPaymentStatus] = useState<"all" | "paid" | "pending">("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    if (paymentStatus === "paid") filtered = filtered.filter(t => t.isPaid);
    else if (paymentStatus === "pending") filtered = filtered.filter(t => !t.isPaid);
    if (startDate) filtered = filtered.filter(t => t.date >= startDate);
    if (endDate) filtered = filtered.filter(t => t.date <= endDate);
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const totalPaidAmount = filteredTasks
    .filter(t => t.isPaid)
    .reduce((total, t) => total + t.piecesCompleted * (t.pieceRate || 0), 0);

  const totalPendingAmount = filteredTasks
    .filter(t => !t.isPaid)
    .reduce((total, t) => total + t.piecesCompleted * (t.pieceRate || 0), 0);

  const handleMarkAsPaid = async (taskId: string) => {
    await updatePaymentStatus(taskId, true, new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-tailor-800 dark:text-tailor-200"
      >
        {t("payments")}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, type: "spring", stiffness: 320, damping: 24 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="transition-theme">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
              <div className="text-2xl font-bold">₹{totalPaidAmount.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-theme">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-amber-500 mr-4" />
              <div className="text-2xl font-bold">₹{totalPendingAmount.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Tabs defaultValue="all" onValueChange={(v) => setPaymentStatus(v as "all" | "paid" | "pending")} className="md:col-span-1">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
          <div className="md:w-1/2">
            <Label htmlFor="startDate" className="mb-1 block text-muted-foreground text-sm">Start Date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="md:w-1/2">
            <Label htmlFor="endDate" className="mb-1 block text-muted-foreground text-sm">End Date</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 300, damping: 24 }}
      >
        <Card className="transition-theme">
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-medium">No payment records found</h3>
                <p className="mt-1 text-muted-foreground">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Pieces Completed</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <motion.tbody variants={container} initial="hidden" animate="show" className="contents">
                    {filteredTasks.map((task) => {
                      const employee = employees.find(e => e.id === task.employeeId);
                      const amount = task.piecesCompleted * (task.pieceRate || 0);
                      return (
                        <motion.tr
                          key={task.id}
                          variants={row}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                          <TableCell>{employee?.name}</TableCell>
                          <TableCell>{task.piecesCompleted}</TableCell>
                          <TableCell>₹{amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={task.isPaid
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                              }
                            >
                              {task.isPaid ? "Paid" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {task.isPaid && task.paymentDate
                              ? new Date(task.paymentDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {!task.isPaid && (
                              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleMarkAsPaid(task.id)}
                                >
                                  Mark as Paid
                                </Button>
                              </motion.div>
                            )}
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Payments;
