import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/services/supabaseService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scissors, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // If session exists, email confirmation is disabled — go to login
      if (authData.session) {
        toast.success("Account created! Please sign in.");
        navigate("/login");
      } else {
        // Email confirmation required — show the check-your-inbox screen
        setConfirmedEmail(data.email);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-tailor-600 flex items-center justify-center mb-3 shadow-lg">
            <Scissors className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-tailor-800">Tailor Task Track</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your workforce with ease</p>
        </div>

        {confirmedEmail ? (
          /* ── Check your inbox screen ── */
          <Card className="shadow-md border-0 text-center">
            <CardContent className="pt-8 pb-8 px-8 space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-tailor-50 flex items-center justify-center">
                  <MailCheck className="h-8 w-8 text-tailor-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-tailor-800">Check your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                We sent a confirmation link to{" "}
                <span className="font-semibold text-gray-700">{confirmedEmail}</span>.
                Click the link in that email to activate your account.
              </p>
              <div className="bg-tailor-50 rounded-lg p-3 text-xs text-tailor-700">
                Can't find it? Check your <strong>spam / junk</strong> folder.
              </div>
              <Button
                className="w-full bg-tailor-600 hover:bg-tailor-700 mt-2"
                onClick={() => navigate("/login")}
              >
                Go to Sign In
              </Button>
              <p className="text-xs text-gray-400">
                Wrong email?{" "}
                <button
                  className="text-tailor-600 hover:underline"
                  onClick={() => setConfirmedEmail(null)}
                >
                  Go back
                </button>
              </p>
            </CardContent>
          </Card>
        ) : (
          /* ── Registration form ── */
          <Card className="shadow-md border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-tailor-800">Create an account</CardTitle>
              <CardDescription>Register to start managing your team</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-tailor-600 hover:bg-tailor-700 mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-tailor-600 hover:text-tailor-700 font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Register;
