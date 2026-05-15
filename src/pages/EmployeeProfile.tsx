
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Phone, MapPin, Calendar, User, CreditCard, QrCode, Edit, IndianRupee } from "lucide-react";
import EmployeeForm from "@/components/EmployeeForm";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 360, damping: 24 } },
};

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, summaries } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [qrZoom, setQrZoom] = useState(false);

  const employee = employees.find((e) => e.id === id);
  const summary = summaries.find((s) => s.employee.id === id);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground text-lg">Employee not found.</p>
        <Button variant="outline" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employees
        </Button>
      </div>
    );
  }

  const hasBankDetails = employee.bankAccountNumber || employee.bankName || employee.ifscCode || employee.branchName || employee.upiId;

  const stats = [
    { label: "Total Pieces", value: summary?.totalPieces ?? 0, isAmount: false },
    { label: "Total Earnings", value: summary?.totalEarnings ?? 0, isAmount: true },
    { label: "Pending Amount", value: summary?.pendingAmount ?? 0, isAmount: true },
    { label: "Paid Amount", value: summary?.paidAmount ?? 0, isAmount: true },
    { label: "Pending Pieces", value: summary?.pendingPieces ?? 0, isAmount: false },
    { label: "Paid Pieces", value: summary?.paidPieces ?? 0, isAmount: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Button variant="ghost" size="icon" onClick={() => navigate("/employees")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>
        <h1 className="text-2xl font-bold text-tailor-800 dark:text-tailor-200">Employee Profile</h1>
        <motion.div className="ml-auto" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 340, damping: 26 }}
          >
            <Card className="transition-theme">
              <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                  className="w-24 h-24 rounded-full border-2 border-tailor-200 dark:border-tailor-700 overflow-hidden flex items-center justify-center bg-tailor-50 dark:bg-tailor-900"
                >
                  {employee.profilePhoto ? (
                    <img src={employee.profilePhoto} alt={employee.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-tailor-300" />
                  )}
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground">Employee</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.14, type: "spring", stiffness: 340, damping: 26 }}
          >
            <Card className="transition-theme">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{employee.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{employee.address}</span>
                </div>
                {employee.joinDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* QR Code */}
          {employee.qrCodePhoto && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 340, damping: 26 }}
            >
              <Card className="transition-theme">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <QrCode className="h-4 w-4" /> Payment QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    src={employee.qrCodePhoto}
                    alt="QR Code"
                    className="w-40 h-40 object-contain cursor-pointer"
                    onClick={() => setQrZoom(true)}
                    title="Click to enlarge"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={card}>
                <Card className="transition-theme hover:shadow-md transition-shadow duration-200">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-lg font-bold flex items-center gap-0.5">
                      {s.isAmount && <IndianRupee className="h-4 w-4" />}
                      {s.isAmount ? s.value.toLocaleString() : s.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Payment status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Payment status:</span>
            {(summary?.pendingAmount ?? 0) > 0 ? (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                ₹{summary!.pendingAmount.toLocaleString()} Pending
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                All Paid
              </Badge>
            )}
          </motion.div>

          {/* Bank details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, type: "spring", stiffness: 300, damping: 24 }}
          >
            <Card className="transition-theme">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasBankDetails ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {employee.bankAccountNumber && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-0.5">Account Number</p>
                        <p className="font-medium font-mono">{employee.bankAccountNumber}</p>
                      </div>
                    )}
                    {employee.bankName && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-0.5">Bank Name</p>
                        <p className="font-medium">{employee.bankName}</p>
                      </div>
                    )}
                    {employee.ifscCode && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-0.5">IFSC Code</p>
                        <p className="font-medium font-mono">{employee.ifscCode}</p>
                      </div>
                    )}
                    {employee.branchName && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-0.5">Branch</p>
                        <p className="font-medium">{employee.branchName}</p>
                      </div>
                    )}
                    {employee.upiId && (
                      <div className="sm:col-span-2">
                        <p className="text-muted-foreground text-xs mb-0.5">UPI ID</p>
                        <p className="font-medium">{employee.upiId}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No bank details added yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
          <EmployeeForm employee={employee} onClose={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* QR zoom dialog */}
      <AnimatePresence>
        {qrZoom && (
          <Dialog open={qrZoom} onOpenChange={setQrZoom}>
            <DialogContent className="flex flex-col items-center gap-4 max-w-sm">
              <DialogHeader><DialogTitle>Payment QR — {employee.name}</DialogTitle></DialogHeader>
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                src={employee.qrCodePhoto}
                alt="QR Code large"
                className="w-64 h-64 object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeProfile;
