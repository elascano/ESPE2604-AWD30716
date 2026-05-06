import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ukxilwyncxikljjzeehg.supabase.co';
const supabaseKey = 'sb_publishable_D4etjOqwNjEon_ujo3HQwg_mQe58Zjc';

export const supabase = createClient(supabaseUrl, supabaseKey);