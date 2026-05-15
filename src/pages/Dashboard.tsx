
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 360, damping: 24 } },
};

const listItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 380, damping: 26 } },
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { summaries, tasks } = useApp();
  const navigate = useNavigate();

  const totalEmployees = summaries.length;
  const totalPieces = summaries.reduce((sum, s) => sum + s.totalPieces, 0);
  const totalEarnings = summaries.reduce((sum, s) => sum + s.totalEarnings, 0);
  const paidPieces = summaries.reduce((sum, s) => sum + s.paidPieces, 0);
  const pendingPieces = summaries.reduce((sum, s) => sum + s.pendingPieces, 0);
  const paidPercentage = totalPieces > 0 ? (paidPieces / totalPieces) * 100 : 0;

  const stats = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: <Users className="h-8 w-8 text-tailor-600 dark:text-tailor-400" />,
      sub: null,
    },
    {
      label: "Total Pieces Completed",
      value: totalPieces,
      icon: <Calendar className="h-8 w-8 text-tailor-600 dark:text-tailor-400" />,
      sub: null,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="text-2xl font-bold text-tailor-800 dark:text-tailor-200"
      >
        {t("dashboard")}
      </motion.h1>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="transition-theme hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {s.icon}
                  <div className="ml-4 text-2xl font-bold">{s.value}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div variants={item}>
          <Card className="transition-theme hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pieces Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Paid</span>
                  <span className="text-sm font-medium">{paidPieces} pieces</span>
                </div>
                <Progress value={paidPercentage} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="text-sm font-medium">{pendingPieces} pieces</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="transition-theme hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Paid: ₹{summaries.reduce((s, x) => s + x.paidAmount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Pending: ₹{summaries.reduce((s, x) => s + x.pendingAmount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top employees */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 300, damping: 24 }}
          className="col-span-1 lg:col-span-2"
        >
          <Card className="transition-theme h-full">
            <CardHeader>
              <CardTitle>Top Performing Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {summaries
                  .sort((a, b) => b.totalPieces - a.totalPieces)
                  .slice(0, 5)
                  .map((summary) => (
                    <motion.div
                      key={summary.employee.id}
                      variants={listItem}
                      className="flex items-center justify-between"
                    >
                      <motion.div
                        className="flex items-center cursor-pointer group"
                        onClick={() => navigate(`/employees/${summary.employee.id}`)}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      >
                        <div className="h-10 w-10 rounded-full bg-tailor-100 dark:bg-tailor-900 flex items-center justify-center text-tailor-700 dark:text-tailor-300 font-semibold overflow-hidden shrink-0">
                          {summary.employee.profilePhoto ? (
                            <img
                              src={summary.employee.profilePhoto}
                              alt={summary.employee.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            summary.employee.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium group-hover:text-tailor-600 dark:group-hover:text-tailor-400 transition-colors">
                            {summary.employee.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{summary.totalPieces} pieces</p>
                        </div>
                      </motion.div>
                      <div className="font-medium">₹{summary.totalEarnings.toLocaleString()}</div>
                    </motion.div>
                  ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activities */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, type: "spring", stiffness: 300, damping: 24 }}
        >
          <Card className="transition-theme h-full">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {tasks
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((task) => {
                    const employee = summaries.find(s => s.employee.id === task.employeeId)?.employee;
                    return (
                      <motion.div
                        key={task.id}
                        variants={listItem}
                        className="border-l-2 border-tailor-400 pl-4 py-1"
                      >
                        <p className="font-medium text-sm">{employee?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.piecesCompleted} pieces · {new Date(task.date).toLocaleDateString()}
                        </p>
                        <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs ${
                          task.isPaid
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
                        }`}>
                          {task.isPaid ? "Paid" : "Pending"}
                        </span>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
