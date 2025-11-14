import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  await fs.mkdir(path.dirname(usersPath), { recursive: true });
  let users = [];
  try {
    const raw = await fs.readFile(usersPath, 'utf8');
    users = JSON.parse(raw || '[]');
  } catch (err) {
    users = [];
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, email, password: hashed };
  users.push(newUser);
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
  res.status(201).json({ message: 'User created' });
}