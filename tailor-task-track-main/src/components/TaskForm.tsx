
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Task } from "../models/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

interface FormValues {
  employeeId: string;
  date: string;
  piecesCompleted: string;
  pieceRate: string; // Added piece rate field
  description?: string;
  isPaid: boolean;
  paymentDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { t } = useLanguage();
  const { employees, addTask, updateTask } = useApp();
  const isEditMode = !!task;

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: task ? {
      employeeId: task.employeeId,
      date: task.date,
      piecesCompleted: task.piecesCompleted.toString(),
      pieceRate: task.pieceRate.toString(), // Added piece rate
      description: task.description || '',
      isPaid: task.isPaid,
      paymentDate: task.paymentDate
    } : {
      date: new Date().toISOString().split('T')[0],
      isPaid: false
    }
  });

  const isPaid = watch("isPaid");

  const onSubmit = (data: FormValues) => {
    const taskData = {
      employeeId: data.employeeId,
      date: data.date,
      piecesCompleted: parseInt(data.piecesCompleted, 10),
      pieceRate: parseFloat(data.pieceRate), // Added piece rate
      description: data.description || undefined,
      isPaid: data.isPaid,
      paymentDate: data.isPaid ? (data.paymentDate || new Date().toISOString().split('T')[0]) : undefined
    };

    if (isEditMode && task) {
      updateTask({ ...taskData, id: task.id });
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employeeId">Employee</Label>
        <Controller
          control={control}
          name="employeeId"
          rules={{ required: true }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.employeeId && <p className="text-sm text-red-500">Employee is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register("date", { required: true })}
        />
        {errors.date && <p className="text-sm text-red-500">Date is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="piecesCompleted">Pieces Completed</Label>
        <Input
          id="piecesCompleted"
          type="number"
          {...register("piecesCompleted", { 
            required: true, 
            pattern: /^[0-9]+$/,
            min: 1 
          })}
        />
        {errors.piecesCompleted && <p className="text-sm text-red-500">Valid number of pieces is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pieceRate">Piece Rate (₹)</Label>
        <Input
          id="pieceRate"
          type="number"
          step="0.01"
          {...register("pieceRate", { 
            required: true, 
            pattern: /^[0-9]*\.?[0-9]+$/,
            min: 0.01 
          })}
        />
        {errors.pieceRate && <p className="text-sm text-red-500">Valid piece rate is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          {...register("description")}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="isPaid"
          render={({ field }) => (
            <Switch 
              checked={field.value} 
              onCheckedChange={field.onChange} 
              id="isPaid"
            />
          )}
        />
        <Label htmlFor="isPaid">Mark as Paid</Label>
      </div>
      
      {isPaid && (
        <div className="space-y-2">
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input
            id="paymentDate"
            type="date"
            {...register("paymentDate")}
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button type="submit" className="bg-tailor-600 hover:bg-tailor-700">
          {t("save")}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
