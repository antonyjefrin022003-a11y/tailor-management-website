
export interface Task {
  id: string;
  employeeId: string;
  date: string;
  piecesCompleted: number;
  pieceRate: number;
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
  // Optional profile & bank details
  profilePhoto?: string;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  branchName?: string;
  upiId?: string;
  qrCodePhoto?: string;
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
