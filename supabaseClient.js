import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error('Supabase environment variables are missing');
}

const supabase = createClient(supabaseUrl, serviceKey);

export default supabase;
