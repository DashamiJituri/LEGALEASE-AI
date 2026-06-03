import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jnwrdqjewvvgruubkfbo.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impud3JkcWpld3Z2Z3J1dWJrZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTE4ODIsImV4cCI6MjA5NTg2Nzg4Mn0.pWgExlpn20q6ddhPA2P33HRot_xPWFS0ZxTp7kSrKz4"

export const supabase = createClient(supabaseUrl, supabaseKey)