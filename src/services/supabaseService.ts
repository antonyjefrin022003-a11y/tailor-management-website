
import { createClient } from "@supabase/supabase-js";
import { Employee, Task } from "../models/types";
import { supabaseConfig } from "../config/supabase";

// Initialize Supabase client with configuration
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

export const employeeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(employee: Omit<Employee, 'id'>) {
    const { data, error } = await supabase
      .from('employees')
      .insert([{
        name: employee.name,
        phone_number: employee.phoneNumber,
        address: employee.address,
        join_date: employee.joinDate
      }])
      .select()
      .single();
    
    if (error) throw error;
    return this.mapFromDatabase(data);
  },

  async update(employee: Employee) {
    const { data, error } = await supabase
      .from('employees')
      .update({
        name: employee.name,
        phone_number: employee.phoneNumber,
        address: employee.address,
        join_date: employee.joinDate
      })
      .eq('id', employee.id)
      .select()
      .single();
    
    if (error) throw error;
    return this.mapFromDatabase(data);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  mapFromDatabase(dbEmployee: any): Employee {
    return {
      id: dbEmployee.id,
      name: dbEmployee.name,
      phoneNumber: dbEmployee.phone_number,
      address: dbEmployee.address,
      joinDate: dbEmployee.join_date
    };
  }
};

export const taskService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(this.mapFromDatabase) || [];
  },

  async create(task: Omit<Task, 'id'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        employee_id: task.employeeId,
        date: task.date,
        pieces_completed: task.piecesCompleted,
        piece_rate: task.pieceRate,
        description: task.description,
        is_paid: task.isPaid,
        payment_date: task.paymentDate
      }])
      .select()
      .single();
    
    if (error) throw error;
    return this.mapFromDatabase(data);
  },

  async update(task: Task) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        employee_id: task.employeeId,
        date: task.date,
        pieces_completed: task.piecesCompleted,
        piece_rate: task.pieceRate,
        description: task.description,
        is_paid: task.isPaid,
        payment_date: task.paymentDate
      })
      .eq('id', task.id)
      .select()
      .single();
    
    if (error) throw error;
    return this.mapFromDatabase(data);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updatePaymentStatus(taskId: string, isPaid: boolean, paymentDate?: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        is_paid: isPaid,
        payment_date: isPaid ? paymentDate : null
      })
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) throw error;
    return this.mapFromDatabase(data);
  },

  mapFromDatabase(dbTask: any): Task {
    return {
      id: dbTask.id,
      employeeId: dbTask.employee_id,
      date: dbTask.date,
      piecesCompleted: dbTask.pieces_completed,
      pieceRate: dbTask.piece_rate || 0, // Add fallback for safety
      description: dbTask.description,
      isPaid: dbTask.is_paid,
      paymentDate: dbTask.payment_date
    };
  }
};
