
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { Employee } from "../models/types";
import EmployeeForm from "@/components/EmployeeForm";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const row = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 380, damping: 26 } },
};

const Employees: React.FC = () => {
  const { t } = useLanguage();
  const { employees, summaries, deleteEmployee, loading } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.phoneNumber.includes(searchTerm)
  );

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEmployee) {
      try {
        await deleteEmployee(selectedEmployee.id);
        setIsDeleteDialogOpen(false);
      } catch { /* handled in context */ }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-tailor-600" />
        <span className="ml-2 text-muted-foreground">Loading employees...</span>
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
        <h1 className="text-2xl font-bold text-tailor-800 dark:text-tailor-200">{t("employees")}</h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button className="bg-tailor-600 hover:bg-tailor-700">
                <Plus className="mr-2 h-4 w-4" /> {t("addEmployee")}
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>{t("addEmployee")}</DialogTitle>
            </DialogHeader>
            <EmployeeForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.24 }}
        className="flex items-center space-x-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 300, damping: 24 }}
      >
        <Card className="transition-theme">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("contact")}</TableHead>
                  <TableHead>{t("piecesCompleted")}</TableHead>
                  <TableHead>{t("totalEarnings")}</TableHead>
                  <TableHead>{t("paymentStatus")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {t("noEmployeesFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  <motion.tbody variants={container} initial="hidden" animate="show" className="contents">
                    {filteredEmployees.map((employee) => {
                      const summary = summaries.find(s => s.employee.id === employee.id);
                      const totalPieces = summary?.totalPieces || 0;
                      const totalEarnings = summary?.totalEarnings || 0;
                      const pendingAmount = summary?.pendingAmount || 0;

                      return (
                        <motion.tr
                          key={employee.id}
                          variants={row}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            <motion.button
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400, damping: 22 }}
                              className="text-tailor-700 dark:text-tailor-300 hover:underline text-left"
                              onClick={() => navigate(`/employees/${employee.id}`)}
                            >
                              {employee.name}
                            </motion.button>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{employee.phoneNumber}</TableCell>
                          <TableCell>{totalPieces}</TableCell>
                          <TableCell>₹{totalEarnings.toLocaleString()}</TableCell>
                          <TableCell>
                            {pendingAmount > 0 ? (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                                {t("pending")}: ₹{pendingAmount.toLocaleString()}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                {t("paid")}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(employee)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(employee)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{t("editEmployee")}</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeForm employee={selectedEmployee} onClose={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("deleteEmployee")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">{selectedEmployee?.name}</span>? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t("cancel")}</Button>
            <Button variant="destructive" onClick={confirmDelete}>{t("confirm")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
