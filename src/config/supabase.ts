
// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || "https://lybsyxncvbxucdkgaaje.supabase.co",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5YnN5eG5jdmJ4dWNka2dhYWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTUyNjQsImV4cCI6MjA5MzQ5MTI2NH0.LnQ3s_V4kEIKRYJ8xCCKvV9ajQWaKAC6QL5VnS4qRTY"
};

// Validate configuration
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  console.warn('Supabase configuration is missing. Please check your environment variables.');
}
