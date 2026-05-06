
import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertCircle, Plus, Loader2 } from "lucide-react";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/models/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

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
    try {
      await updatePaymentStatus(task.id, true, new Date().toISOString().split('T')[0]);
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const handleMarkAsPending = async (task: Task) => {
    try {
      await updatePaymentStatus(task.id, false);
    } catch (error) {
      // Error is already handled in the context
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-tailor-800">{t("tasks")}</h1>
        
        <Button className="bg-tailor-600 hover:bg-tailor-700" onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <Tabs defaultValue="all" onValueChange={(value) => setPaymentStatus(value as "all" | "paid" | "pending")}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
          <p className="mt-1 text-gray-500">Add a new task or adjust your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const employee = employees.find(e => e.id === task.employeeId);
            // Add fallback for pieceRate in case it's undefined
            const pieceRate = task.pieceRate || 0;
            const totalAmount = pieceRate * task.piecesCompleted;
            
            return (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-md font-medium flex items-center gap-2">
                    {employee?.name}
                    {task.description && (
                      <Popover>
                        <PopoverTrigger>
                          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          {task.description}
                        </PopoverContent>
                      </Popover>
                    )}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={task.isPaid ? 
                      "bg-green-50 text-green-700 border-green-200" : 
                      "bg-amber-50 text-amber-700 border-amber-200"}
                  >
                    {task.isPaid ? t("paid") : t("pending")}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span>{new Date(task.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pieces Completed:</span>
                    <span className="font-medium">{task.piecesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Piece Rate:</span>
                    <span>₹{pieceRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  
                  {task.isPaid && task.paymentDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Payment Date:</span>
                      <span>{new Date(task.paymentDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {task.description && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Description:</span>
                      <span className="max-w-[200px] truncate">{task.description}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 flex justify-end space-x-2">
                    {!task.isPaid ? (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleMarkAsPaid(task)}
                      >
                        <CheckCircle className="mr-2 h-3 w-3" />
                        Mark as Paid
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkAsPending(task)}
                      >
                        <AlertCircle className="mr-2 h-3 w-3" />
                        Mark as Pending
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onClose={() => setIsTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
