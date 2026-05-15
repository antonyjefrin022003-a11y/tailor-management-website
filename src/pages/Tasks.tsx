
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertCircle, Plus, Loader2, Pencil } from "lucide-react";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/models/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 360, damping: 24 },
  },
};

const Tasks: React.FC = () => {
  const { t } = useLanguage();
  const { employees, tasks, updatePaymentStatus, loading } = useApp();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"all" | "paid" | "pending">("all");

  const filteredTasks = tasks.filter(task => {
    const employeeMatch = selectedEmployeeId === "all" || task.employeeId === selectedEmployeeId;
    const statusMatch = paymentStatus === "all" ||
      (paymentStatus === "paid" && task.isPaid) ||
      (paymentStatus === "pending" && !task.isPaid);
    return employeeMatch && statusMatch;
  });

  const handleMarkAsPaid = async (task: Task) => {
    try { await updatePaymentStatus(task.id, true, new Date().toISOString().split('T')[0]); } catch { /* handled */ }
  };

  const handleMarkAsPending = async (task: Task) => {
    try { await updatePaymentStatus(task.id, false); } catch { /* handled */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-tailor-600" />
        <span className="ml-2 text-muted-foreground">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h1 className="text-2xl font-bold text-tailor-800 dark:text-tailor-200">{t("tasks")}</h1>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button className="bg-tailor-600 hover:bg-tailor-700" onClick={() => { setSelectedTask(null); setIsTaskDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div>
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
        </div>
        <div>
          <Tabs defaultValue="all" onValueChange={(v) => setPaymentStatus(v as "all" | "paid" | "pending")}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-card rounded-lg border transition-theme"
        >
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
          <p className="mt-1 text-muted-foreground">Add a new task or adjust your filters.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => {
              const employee = employees.find(e => e.id === task.employeeId);
              const pieceRate = task.pieceRate || 0;
              const totalAmount = pieceRate * task.piecesCompleted;

              return (
                <motion.div key={task.id} variants={cardItem} layout exit={{ opacity: 0, scale: 0.9, y: 10 }}>
                  <Card className="overflow-hidden transition-theme hover:shadow-md transition-shadow duration-200 h-full">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                      <CardTitle className="text-md font-medium flex items-center gap-2">
                        {employee?.name}
                        {task.description && (
                          <Popover>
                            <PopoverTrigger>
                              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </PopoverTrigger>
                            <PopoverContent className="text-sm">{task.description}</PopoverContent>
                          </Popover>
                        )}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={task.isPaid
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                        }
                      >
                        {task.isPaid ? t("paid") : t("pending")}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(task.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Pieces Completed:</span>
                        <span className="font-medium">{task.piecesCompleted}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Piece Rate:</span>
                        <span>₹{pieceRate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total Amount:</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                      {task.isPaid && task.paymentDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Payment Date:</span>
                          <span>{new Date(task.paymentDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="pt-2 flex justify-end space-x-2">
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedTask(task); setIsTaskDialogOpen(true); }}>
                            <Pencil className="mr-2 h-3 w-3" /> Edit
                          </Button>
                        </motion.div>
                        {!task.isPaid ? (
                          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleMarkAsPaid(task)}>
                              <CheckCircle className="mr-2 h-3 w-3" /> Mark as Paid
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                            <Button size="sm" variant="outline" onClick={() => handleMarkAsPending(task)}>
                              <AlertCircle className="mr-2 h-3 w-3" /> Mark as Pending
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask ?? undefined}
            onClose={() => { setIsTaskDialogOpen(false); setSelectedTask(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
