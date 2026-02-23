// Supabase Configuration
const SUPABASE_URL = "https://gpgfenwzrgqwcasrlmwm.supabase.co";
// Using the Anon Public Key you provided
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZ2Zlbnd6cmdxd2Nhc3JsbXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTU5MTYsImV4cCI6MjA4NTQ5MTkxNn0.c2Wk5gm6uXsbg_bszUXsv-aZ0JKyV-Nz17KYJTDuPa0";

// Initialize the client
const _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make it globally accessible
window.supabase = _supabaseInstance;

console.log("G'SHOT Cloud Database connected.");
