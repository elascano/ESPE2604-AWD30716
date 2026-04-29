import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mepuffhlghenorhrtkvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHVmZmhsZ2hlbm9yaHJ0a3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzM4MTQsImV4cCI6MjA5MjgwOTgxNH0.dYGxRxvUS_PzB64Wu27Z2L8LdxYOl1AOK0gfenHOQjo';

export const supabase = createClient(supabaseUrl, supabaseKey);
