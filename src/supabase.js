import { createClient } from '@supabase/supabase-js';

const supabaseUrl = ' https://ywtngdmvlfgoptwdejje.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dG5nZG12bGZnb3B0d2RlamplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjIyMzksImV4cCI6MjA5NzQzODIzOX0.2wFMBxHWhNinbsJd_dZ4W4SR7btKlJhJSe-x__5Q1aY';

export const supabase = createClient(supabaseUrl, supabaseKey);
