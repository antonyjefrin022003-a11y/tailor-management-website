
export interface Task {
  id: string;
  employeeId: string;
  date: string;
  piecesCompleted: number;
  pieceRate: number; // Moved from Employee to Task
  description?: string;
  isPaid: boolean;
  paymentDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
  // Removed pieceRate from here
}

export interface EmployeeSummary {
  employee: Employee;
  totalPieces: number;
  totalEarnings: number;
  paidPieces: number;
  pendingPieces: number;
  paidAmount: number;
  pendingAmount: number;
}

export type PaymentStatus = "all" | "paid" | "pending";
