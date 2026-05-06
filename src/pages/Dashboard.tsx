
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { summaries, tasks } = useApp();

  const totalEmployees = summaries.length;
  const totalPieces = summaries.reduce((sum, summary) => sum + summary.totalPieces, 0);
  const totalEarnings = summaries.reduce((sum, summary) => sum + summary.totalEarnings, 0);
  
  const paidPieces = summaries.reduce((sum, summary) => sum + summary.paidPieces, 0);
  const pendingPieces = summaries.reduce((sum, summary) => sum + summary.pendingPieces, 0);
  
  const paidPercentage = totalPieces > 0 ? (paidPieces / totalPieces) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-tailor-800">{t("dashboard")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-tailor-600 mr-4" />
              <div>
                <div className="text-2xl font-bold">{totalEmployees}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pieces Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-tailor-600 mr-4" />
              <div>
                <div className="text-2xl font-bold">{totalPieces}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pieces Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Paid</span>
                <span className="text-sm font-medium">{paidPieces} pieces</span>
              </div>
              <Progress value={paidPercentage} className="h-2" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="text-sm font-medium">{pendingPieces} pieces</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-gray-500">Paid: ₹{summaries.reduce((sum, s) => sum + s.paidAmount, 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-sm text-gray-500">Pending: ₹{summaries.reduce((sum, s) => sum + s.pendingAmount, 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaries
                .sort((a, b) => b.totalPieces - a.totalPieces)
                .slice(0, 5)
                .map((summary) => (
                  <div key={summary.employee.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-tailor-100 flex items-center justify-center text-tailor-700 font-semibold">
                        {summary.employee.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{summary.employee.name}</p>
                        <p className="text-sm text-gray-500">{summary.totalPieces} pieces</p>
                      </div>
                    </div>
                    <div className="font-medium">₹{summary.totalEarnings.toLocaleString()}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((task) => {
                  const employee = summaries.find(s => s.employee.id === task.employeeId)?.employee;
                  return (
                    <div key={task.id} className="border-l-2 border-tailor-400 pl-4 py-1">
                      <p className="font-medium">{employee?.name ?? "Unknown Employee"}</p>
                      <p className="text-sm text-gray-500">
                        Completed {task.piecesCompleted} pieces on {new Date(task.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${task.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {task.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </p>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
