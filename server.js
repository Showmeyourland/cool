import express from 'express';
import dotenv from 'dotenv';
import supabase from './supabaseClient.js';

dotenv.config();

const app = express();
app.use(express.json());

function validEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!validEmail(email) || !validPassword(password)) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const userId = data.user.id;
  await supabase.from('profiles').insert({ id: userId, total_minutes_used: 0 }).select();
  await supabase.from('sessions').insert({ user_id: userId, started_at: new Date().toISOString() });
  res.json({ userId });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!validEmail(email) || !validPassword(password)) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  const userId = data.user.id;
  await supabase.from('sessions').insert({ user_id: userId, started_at: new Date().toISOString() });
  const { data: profile } = await supabase.from('profiles').select('total_minutes_used').eq('id', userId).single();
  res.json({ userId, total_minutes_used: profile ? profile.total_minutes_used : 0 });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
