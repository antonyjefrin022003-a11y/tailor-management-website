
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Employee } from "../models/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

interface FormValues {
  name: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose }) => {
  const { t } = useLanguage();
  const { addEmployee, updateEmployee } = useApp();
  const isEditMode = !!employee;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: employee ? {
      name: employee.name,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      joinDate: employee.joinDate,
    } : {
      joinDate: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = (data: FormValues) => {
    const employeeData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      joinDate: data.joinDate,
    };

    if (isEditMode && employee) {
      updateEmployee({ ...employeeData, id: employee.id });
    } else {
      addEmployee(employeeData);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
        />
        {errors.name && <p className="text-sm text-red-500">Name is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
        <Input
          id="phoneNumber"
          {...register("phoneNumber", { required: true, pattern: /^[0-9]{10}$/ })}
        />
        {errors.phoneNumber && <p className="text-sm text-red-500">Valid 10-digit phone number required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">{t("address")}</Label>
        <Input
          id="address"
          {...register("address", { required: true })}
        />
        {errors.address && <p className="text-sm text-red-500">Address is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="joinDate">{t("joinDate")}</Label>
        <Input
          id="joinDate"
          type="date"
          {...register("joinDate", { required: true })}
        />
        {errors.joinDate && <p className="text-sm text-red-500">Join date is required</p>}
      </div>
      
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

export default EmployeeForm;
