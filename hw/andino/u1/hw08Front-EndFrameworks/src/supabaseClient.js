import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mibitvmvognqfzzhobqg.supabase.co'
const supabaseAnonKey = 'sb_publishable_jOAdRf4yNBzsL2KC-8RsKQ_QtKRXFLo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)