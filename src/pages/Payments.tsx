
import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, Calendar } from "lucide-react";

const Payments: React.FC = () => {
  const { t } = useLanguage();
  const { employees, tasks, updatePaymentStatus } = useApp();
  const [paymentStatus, setPaymentStatus] = useState<"all" | "paid" | "pending">("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Filter by payment status
    if (paymentStatus === "paid") {
      filtered = filtered.filter(task => task.isPaid);
    } else if (paymentStatus === "pending") {
      filtered = filtered.filter(task => !task.isPaid);
    }
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(task => task.date >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(task => task.date <= endDate);
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  
  // Calculate total pending and paid amounts using task.pieceRate with fallback
  const totalPaidAmount = filteredTasks
    .filter(task => task.isPaid)
    .reduce((total, task) => {
      const pieceRate = task.pieceRate || 0;
      return total + (task.piecesCompleted * pieceRate);
    }, 0);
    
  const totalPendingAmount = filteredTasks
    .filter(task => !task.isPaid)
    .reduce((total, task) => {
      const pieceRate = task.pieceRate || 0;
      return total + (task.piecesCompleted * pieceRate);
    }, 0);

  const handleMarkAsPaid = async (taskId: string) => {
    await updatePaymentStatus(taskId, true, new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-tailor-800">{t("payments")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Paid Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
              <div className="text-2xl font-bold">₹{totalPaidAmount.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-amber-500 mr-4" />
              <div className="text-2xl font-bold">₹{totalPendingAmount.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tabs defaultValue="all" onValueChange={(value) => setPaymentStatus(value as "all" | "paid" | "pending")} className="md:col-span-1">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
          <div className="md:w-1/2">
            <Label htmlFor="startDate" className="mb-1 block">Start Date</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="md:w-1/2">
            <Label htmlFor="endDate" className="mb-1 block">End Date</Label>
            <Input 
              id="endDate" 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium">No payment records found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters.</p>
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
                <TableBody>
                  {filteredTasks.map((task) => {
                    const employee = employees.find(emp => emp.id === task.employeeId);
                    const pieceRate = task.pieceRate || 0; // Add fallback for undefined pieceRate
                    const amount = task.piecesCompleted * pieceRate;
                    
                    return (
                      <TableRow key={task.id}>
                        <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                        <TableCell>{employee?.name}</TableCell>
                        <TableCell>{task.piecesCompleted}</TableCell>
                        <TableCell>₹{amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" 
                            className={task.isPaid ? 
                              "bg-green-50 text-green-700 border-green-200" : 
                              "bg-amber-50 text-amber-700 border-amber-200"}>
                            {task.isPaid ? "Paid" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {task.isPaid && task.paymentDate ? 
                            new Date(task.paymentDate).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {!task.isPaid && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleMarkAsPaid(task.id)}
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
