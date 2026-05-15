
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { IndianRupee } from "lucide-react";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

interface FormValues {
  employeeId: string;
  date: string;
  piecesCompleted: string;
  pieceRate: string;
  description?: string;
  isPaid: boolean;
  paymentDate?: string;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring" as const, stiffness: 400, damping: 28 },
  }),
};

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { t } = useLanguage();
  const { employees, addTask, updateTask } = useApp();
  const isEditMode = !!task;

  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: task ? {
      employeeId: task.employeeId,
      date: task.date,
      piecesCompleted: task.piecesCompleted.toString(),
      pieceRate: (task.pieceRate || 0).toString(),
      description: task.description || '',
      isPaid: task.isPaid,
      paymentDate: task.paymentDate
    } : {
      date: new Date().toISOString().split('T')[0],
      isPaid: false
    }
  });

  const isPaid = watch("isPaid");
  const piecesCompleted = watch("piecesCompleted");
  const pieceRate = watch("pieceRate");
  const totalAmount = (parseFloat(piecesCompleted) || 0) * (parseFloat(pieceRate) || 0);

  const onSubmit = (data: FormValues) => {
    const taskData = {
      employeeId: data.employeeId,
      date: data.date,
      piecesCompleted: parseInt(data.piecesCompleted, 10),
      pieceRate: parseFloat(data.pieceRate),
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
      <motion.div className="space-y-2" custom={0} variants={fieldVariants} initial="hidden" animate="show">
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
      </motion.div>

      <motion.div className="space-y-2" custom={1} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" {...register("date", { required: true })} />
        {errors.date && <p className="text-sm text-red-500">Date is required</p>}
      </motion.div>

      <motion.div className="space-y-2" custom={2} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="piecesCompleted">Pieces Completed</Label>
        <Input
          id="piecesCompleted"
          type="number"
          {...register("piecesCompleted", { required: true, pattern: /^[0-9]+$/, min: 1 })}
        />
        {errors.piecesCompleted && <p className="text-sm text-red-500">Valid number of pieces is required</p>}
      </motion.div>

      <motion.div className="space-y-2" custom={3} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="pieceRate">Piece Rate (₹)</Label>
        <Input
          id="pieceRate"
          type="number"
          step="0.01"
          {...register("pieceRate", { required: true, pattern: /^[0-9]*\.?[0-9]+$/, min: 0.01 })}
        />
        {errors.pieceRate && <p className="text-sm text-red-500">Valid piece rate is required</p>}
      </motion.div>

      {/* Animated total amount */}
      <AnimatePresence>
        {totalAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.6, y: -8 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.6, y: -8 }}
            transition={{ type: "spring", stiffness: 480, damping: 26 }}
            style={{ originY: 0 }}
            className="flex items-center justify-between rounded-lg bg-tailor-50 dark:bg-tailor-950/40 border border-tailor-200 dark:border-tailor-800 px-4 py-3"
          >
            <span className="text-sm font-medium text-tailor-700 dark:text-tailor-300">Total Amount</span>
            <motion.span
              key={totalAmount}
              initial={{ scale: 1.25, color: "#5272b5" }}
              animate={{ scale: 1, color: "inherit" }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="text-xl font-bold text-tailor-800 dark:text-tailor-200 flex items-center gap-1"
            >
              <IndianRupee className="h-5 w-5" />
              {totalAmount.toLocaleString()}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="space-y-2" custom={4} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter task description"
          {...register("description")}
          className="min-h-[80px]"
        />
      </motion.div>

      <motion.div className="flex items-center space-x-2" custom={5} variants={fieldVariants} initial="hidden" animate="show">
        <Controller
          control={control}
          name="isPaid"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} id="isPaid" />
          )}
        />
        <Label htmlFor="isPaid">Mark as Paid</Label>
      </motion.div>

      <AnimatePresence>
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-2 overflow-hidden"
          >
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              {...register("paymentDate")}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("cancel")}
        </Button>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" className="bg-tailor-600 hover:bg-tailor-700">
            {t("save")}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default TaskForm;
