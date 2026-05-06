import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "english" | "hindi" | "tamil" | "marathi";

type TranslationKey = 
  | "dashboard"
  | "employees"
  | "tasks"
  | "reports"
  | "payments"
  | "settings"
  | "addEmployee"
  | "editEmployee"
  | "deleteEmployee"
  | "name"
  | "contact"
  | "pieceRate"
  | "piecesCompleted"
  | "totalEarnings"
  | "paymentStatus"
  | "paid"
  | "pending"
  | "actions"
  | "save"
  | "cancel"
  | "confirm"
  | "search"
  | "noEmployeesFound"
  | "addNewEmployee"
  | "phoneNumber"
  | "address"
  | "joinDate"
  | "sign_out"
  | "admin"; // Added new translation key

interface Translations {
  [key: string]: {
    [key in TranslationKey]: string;
  };
}

const translations: Translations = {
  english: {
    dashboard: "Dashboard",
    employees: "Employees",
    tasks: "Tasks",
    reports: "Reports",
    payments: "Payments",
    settings: "Settings",
    addEmployee: "Add Employee",
    editEmployee: "Edit Employee",
    deleteEmployee: "Delete Employee",
    name: "Name",
    contact: "Contact",
    pieceRate: "Piece Rate",
    piecesCompleted: "Pieces Completed",
    totalEarnings: "Total Earnings",
    paymentStatus: "Payment Status",
    paid: "Paid",
    pending: "Pending",
    actions: "Actions",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    search: "Search",
    noEmployeesFound: "No employees found",
    addNewEmployee: "Add New Employee",
    phoneNumber: "Phone Number",
    address: "Address",
    joinDate: "Join Date",
    sign_out: "Sign Out",
    admin: "Admin"
  },
  hindi: {
    dashboard: "डैशबोर्ड",
    employees: "कर्मचारी",
    tasks: "कार्य",
    reports: "रिपोर्ट",
    payments: "भुगतान",
    settings: "सेटिंग्स",
    addEmployee: "कर्मचारी जोड़ें",
    editEmployee: "कर्मचारी संपादित करें",
    deleteEmployee: "कर्मचारी हटाएं",
    name: "नाम",
    contact: "संपर्क",
    pieceRate: "टुकड़ा दर",
    piecesCompleted: "पूरे किए गए टुकड़े",
    totalEarnings: "कुल कमाई",
    paymentStatus: "भुगतान स्थिति",
    paid: "भुगतान किया गया",
    pending: "लंबित",
    actions: "क्रियाएँ",
    save: "सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    search: "खोज",
    noEmployeesFound: "कोई कर्मचारी नहीं मिला",
    addNewEmployee: "नया कर्मचारी जोड़ें",
    phoneNumber: "फोन नंबर",
    address: "पता",
    joinDate: "शामिल होने की तारीख",
    sign_out: "साइन आउट",
    admin: "व्यवस्थापक"
  },
  tamil: {
    dashboard: "டாஷ்போர்டு",
    employees: "ஊழியர்கள்",
    tasks: "பணிகள்",
    reports: "அறிக்கைகள்",
    payments: "கொடுப்பனவுகள்",
    settings: "அமைப்புகள்",
    addEmployee: "ஊழியரைச் சேர்க்க",
    editEmployee: "ஊழியரைத் திருத்த",
    deleteEmployee: "ஊழியரை நீக்க",
    name: "பெயர்",
    contact: "தொடர்பு",
    pieceRate: "துண்டு விகிதம்",
    piecesCompleted: "முடிந்த துண்டுகள்",
    totalEarnings: "மொத்த வருவாய்",
    paymentStatus: "கட்டண நிலை",
    paid: "செலுத்தப்பட்டது",
    pending: "நிலுவையில் உள்ளது",
    actions: "செயல்கள்",
    save: "சேமி",
    cancel: "ரத்து செய்",
    confirm: "உறுதிப்படுத்து",
    search: "தேடு",
    noEmployeesFound: "ஊழியர்கள் எவரும் இல்லை",
    addNewEmployee: "புதிய ஊழியரைச் சேர்க்க",
    phoneNumber: "தொலைபேசி எண்",
    address: "முகவரி",
    joinDate: "சேர்ந்த தேதி",
    sign_out: "வெளியேறு",
    admin: "நிர்வாகி"
  },
  marathi: {
    dashboard: "डॅशबोर्ड",
    employees: "कर्मचारी",
    tasks: "कार्ये",
    reports: "अहवाल",
    payments: "देयके",
    settings: "सेटिंग्ज",
    addEmployee: "कर्मचारी जोडा",
    editEmployee: "कर्मचारी संपादित करा",
    deleteEmployee: "कर्मचारी हटवा",
    name: "नाव",
    contact: "संपर्क",
    pieceRate: "तुकडा दर",
    piecesCompleted: "पूर्ण केलेले तुकडे",
    totalEarnings: "एकूण कमाई",
    paymentStatus: "देयक स्थिती",
    paid: "दिले",
    pending: "प्रलंबित",
    actions: "क्रिया",
    save: "जतन करा",
    cancel: "रद्द करा",
    confirm: "पुष्टी करा",
    search: "शोध",
    noEmployeesFound: "कोणतेही कर्मचारी सापडले नाहीत",
    addNewEmployee: "नवीन कर्मचारी जोडा",
    phoneNumber: "फोन नंबर",
    address: "पत्ता",
    joinDate: "सामील होण्याची तारीख",
    sign_out: "साइन आउट",
    admin: "प्रशासक"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("english");

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
