
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Employee, Task, EmployeeSummary, PaymentStatus } from "../models/types";
import { employeeService, taskService } from "../services/supabaseService";
import { toast } from "sonner";

interface AppContextType {
  employees: Employee[];
  tasks: Task[];
  paymentFilter: PaymentStatus;
  searchTerm: string;
  summaries: EmployeeSummary[];
  loading: boolean;
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updatePaymentStatus: (taskId: string, isPaid: boolean, paymentDate?: string) => Promise<void>;
  setPaymentFilter: (status: PaymentStatus) => void;
  setSearchTerm: (term: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const summaries = React.useMemo(() => {
    const allSummaries = employees.map(employee => {
      const employeeTasks = tasks.filter(task => task.employeeId === employee.id);
      const totalPieces = employeeTasks.reduce((sum, task) => sum + task.piecesCompleted, 0);
      const totalEarnings = employeeTasks.reduce((sum, task) => {
        const pieceRate = task.pieceRate || 0; // Add fallback for undefined pieceRate
        return sum + (task.piecesCompleted * pieceRate);
      }, 0);
      
      const paidTasks = employeeTasks.filter(task => task.isPaid);
      const pendingTasks = employeeTasks.filter(task => !task.isPaid);
      
      const paidPieces = paidTasks.reduce((sum, task) => sum + task.piecesCompleted, 0);
      const pendingPieces = pendingTasks.reduce((sum, task) => sum + task.piecesCompleted, 0);
      
      const paidAmount = paidTasks.reduce((sum, task) => {
        const pieceRate = task.pieceRate || 0; // Add fallback
        return sum + (task.piecesCompleted * pieceRate);
      }, 0);
      const pendingAmount = pendingTasks.reduce((sum, task) => {
        const pieceRate = task.pieceRate || 0; // Add fallback
        return sum + (task.piecesCompleted * pieceRate);
      }, 0);
      
      return {
        employee,
        totalPieces,
        totalEarnings,
        paidPieces,
        pendingPieces,
        paidAmount,
        pendingAmount
      };
    });

    return allSummaries;
  }, [employees, tasks]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [employeesData, tasksData] = await Promise.all([
        employeeService.getAll(),
        taskService.getAll()
      ]);
      
      // Properly map the employee data
      const mappedEmployees = employeesData.map((e) => employeeService.mapFromDatabase(e));
      setEmployees(mappedEmployees);
      
      // Ensure tasks data is properly typed as Task[]
      const mappedTasks = tasksData as Task[];
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Failed to load data from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      const newEmployee = await employeeService.create(employee);
      setEmployees(prev => [newEmployee, ...prev]);
      toast.success("Employee added successfully");
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error("Failed to add employee");
      throw error;
    }
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    try {
      const updated = await employeeService.update(updatedEmployee);
      setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error("Failed to update employee");
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeService.delete(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setTasks(prev => prev.filter(task => task.employeeId !== id));
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error("Failed to delete employee");
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const newTask = await taskService.create(task);
      setTasks(prev => [newTask, ...prev]);
      toast.success("Task added successfully");
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task");
      throw error;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const updated = await taskService.update(updatedTask);
      setTasks(prev => prev.map(task => task.id === updated.id ? updated : task));
      toast.success("Task updated successfully");
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
      throw error;
    }
  };

  const updatePaymentStatus = async (taskId: string, isPaid: boolean, paymentDate?: string) => {
    try {
      const updated = await taskService.updatePaymentStatus(taskId, isPaid, paymentDate);
      setTasks(prev => prev.map(task => task.id === updated.id ? updated : task));
      toast.success(`Payment status ${isPaid ? 'marked as paid' : 'marked as pending'}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error("Failed to update payment status");
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      employees,
      tasks,
      paymentFilter,
      searchTerm,
      summaries,
      loading,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addTask,
      updateTask,
      deleteTask,
      updatePaymentStatus,
      setPaymentFilter,
      setSearchTerm,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
