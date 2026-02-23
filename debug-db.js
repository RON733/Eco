
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://gpgfenwzrgqwcasrlmwm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwZ2Zlbnd6cmdxd2Nhc3JsbXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTU5MTYsImV4cCI6MjA4NTQ5MTkxNn0.c2Wk5gm6uXsbg_bszUXsv-aZ0JKyV-Nz17KYJTDuPa0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTable() {
    console.log("Checking 'bookings' table structure...");
    const { data, error } = await supabase.from('bookings').select('*').limit(1);

    if (error) {
        console.error("Error fetching bookings:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Sample booking found. Columns:", Object.keys(data[0]));
        console.log("ID Type:", typeof data[0].id);
    } else {
        console.log("No bookings found in table.");
        // Try to insert a dummy one to see if it works and what columns it has
        const { data: insertData, error: insertError } = await supabase.from('bookings').insert([{
            customer_name: "Test",
            customer_email: "test@example.com",
            service_type: "catering",
            status: "pending"
        }]).select();

        if (insertError) {
            console.error("Insert error (maybe missing columns?):", insertError);
        } else {
            console.log("Inserted test booking. Columns:", Object.keys(insertData[0]));
            // Clean up
            await supabase.from('bookings').delete().eq('id', insertData[0].id);
        }
    }
}

checkTable();
