
// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || "https://lvoyhswchydeunuhtnta.supabase.co",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2b3loc3djaHlkZXVudWh0bnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTE4MzMsImV4cCI6MjA2MDk2NzgzM30.ViF74aPcl41dSiKa3axoqOoI3W7eyftTrbuXVAHs62c"
};

// Validate configuration
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  console.warn('Supabase configuration is missing. Please check your environment variables.');
}
