
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Employee } from "../models/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { User, QrCode, X } from "lucide-react";

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

interface FormValues {
  name: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, type: "spring" as const, stiffness: 420, damping: 28 },
  }),
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose }) => {
  const { t } = useLanguage();
  const { addEmployee, updateEmployee } = useApp();
  const isEditMode = !!employee;

  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(employee?.profilePhoto);
  const [qrCodePhoto, setQrCodePhoto] = useState<string | undefined>(employee?.qrCodePhoto);
  const [qrError, setQrError] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: employee?.name ?? "",
      phoneNumber: employee?.phoneNumber ?? "",
      address: employee?.address ?? "",
      joinDate: employee?.joinDate ?? "",
      bankAccountNumber: employee?.bankAccountNumber ?? "",
      bankName: employee?.bankName ?? "",
      ifscCode: employee?.ifscCode ?? "",
      branchName: employee?.branchName ?? "",
      upiId: employee?.upiId ?? "",
    }
  });

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string | undefined) => void,
    clearError?: () => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setter(base64);
    clearError?.();
  };

  const onSubmit = async (data: FormValues) => {
    if (!qrCodePhoto) {
      setQrError(true);
      return;
    }
    setQrError(false);

    const employeeData: Omit<Employee, "id"> = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      profilePhoto: profilePhoto || undefined,
      bankAccountNumber: data.bankAccountNumber || undefined,
      bankName: data.bankName || undefined,
      ifscCode: data.ifscCode || undefined,
      branchName: data.branchName || undefined,
      upiId: data.upiId || undefined,
      qrCodePhoto: qrCodePhoto || undefined,
    };

    if (isEditMode && employee) {
      await updateEmployee({ ...employeeData, id: employee.id });
    } else {
      await addEmployee(employeeData);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[72vh] overflow-y-auto pr-1">

      {/* Profile photo — optional */}
      <motion.div
        custom={0} variants={fieldVariants} initial="hidden" animate="show"
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-tailor-500 transition-colors"
          onClick={() => profileInputRef.current?.click()}
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </motion.div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => profileInputRef.current?.click()}>
            {profilePhoto ? "Change Photo" : "Upload Photo"}
          </Button>
          {profilePhoto && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setProfilePhoto(undefined)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, setProfilePhoto)}
        />
        <p className="text-xs text-muted-foreground">Profile photo (optional)</p>
      </motion.div>

      {/* Basic info */}
      <motion.div className="space-y-2" custom={1} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="name">{t("name")} <span className="text-red-500">*</span></Label>
        <Input id="name" {...register("name", { required: true })} />
        {errors.name && <p className="text-sm text-red-500">Name is required</p>}
      </motion.div>

      <motion.div className="space-y-2" custom={2} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="phoneNumber">{t("phoneNumber")} <span className="text-red-500">*</span></Label>
        <Input id="phoneNumber" {...register("phoneNumber", { required: true, pattern: /^[0-9]{10}$/ })} />
        {errors.phoneNumber && <p className="text-sm text-red-500">Valid 10-digit phone number required</p>}
      </motion.div>

      <motion.div className="space-y-2" custom={3} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="address">{t("address")} <span className="text-red-500">*</span></Label>
        <Input id="address" {...register("address", { required: true })} />
        {errors.address && <p className="text-sm text-red-500">Address is required</p>}
      </motion.div>

      <motion.div className="space-y-2" custom={4} variants={fieldVariants} initial="hidden" animate="show">
        <Label htmlFor="joinDate">{t("joinDate")} <span className="text-xs text-muted-foreground">(optional)</span></Label>
        <Input id="joinDate" type="date" {...register("joinDate")} />
      </motion.div>

      {/* Bank details — all required */}
      <motion.div className="border-t pt-4" custom={5} variants={fieldVariants} initial="hidden" animate="show">
        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide text-xs">
          Bank Details
        </p>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="bankAccountNumber">Account Number <span className="text-red-500">*</span></Label>
            <Input
              id="bankAccountNumber"
              placeholder="e.g. 123456789012"
              {...register("bankAccountNumber", { required: true })}
            />
            {errors.bankAccountNumber && <p className="text-sm text-red-500">Account number is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name <span className="text-red-500">*</span></Label>
            <Input
              id="bankName"
              placeholder="e.g. State Bank of India"
              {...register("bankName", { required: true })}
            />
            {errors.bankName && <p className="text-sm text-red-500">Bank name is required</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code <span className="text-red-500">*</span></Label>
              <Input
                id="ifscCode"
                placeholder="e.g. SBIN0001234"
                {...register("ifscCode", { required: true })}
              />
              {errors.ifscCode && <p className="text-sm text-red-500">Required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch <span className="text-red-500">*</span></Label>
              <Input
                id="branchName"
                placeholder="e.g. Anna Nagar"
                {...register("branchName", { required: true })}
              />
              {errors.branchName && <p className="text-sm text-red-500">Required</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID <span className="text-red-500">*</span></Label>
            <Input
              id="upiId"
              placeholder="e.g. name@upi"
              {...register("upiId", { required: true })}
            />
            {errors.upiId && <p className="text-sm text-red-500">UPI ID is required</p>}
          </div>
        </div>
      </motion.div>

      {/* QR Code — required */}
      <motion.div className="border-t pt-4" custom={6} variants={fieldVariants} initial="hidden" animate="show">
        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide text-xs">
          Payment QR Code <span className="text-red-500">*</span>
        </p>
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`w-20 h-20 border-2 border-dashed rounded flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${qrError ? "border-red-400" : "border-border hover:border-tailor-500"}`}
            onClick={() => qrInputRef.current?.click()}
          >
            {qrCodePhoto ? (
              <img src={qrCodePhoto} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="h-8 w-8 text-muted-foreground" />
            )}
          </motion.div>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => qrInputRef.current?.click()}>
              {qrCodePhoto ? "Change QR Code" : "Upload QR Code"}
            </Button>
            {qrCodePhoto && (
              <Button type="button" variant="ghost" size="sm" onClick={() => { setQrCodePhoto(undefined); setQrError(true); }}>
                <X className="h-4 w-4 mr-1" /> Remove
              </Button>
            )}
          </div>
        </div>
        <input
          ref={qrInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, setQrCodePhoto, () => setQrError(false))}
        />
        {qrError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 mt-2"
          >
            Payment QR code is required
          </motion.p>
        )}
      </motion.div>

      <div className="flex justify-end space-x-2 pt-2 border-t">
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

export default EmployeeForm;
