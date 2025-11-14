import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const usersPath = path.join(process.cwd(), 'data', 'users.json');
  try {
    const raw = await fs.readFile(usersPath, 'utf8');
    const users = JSON.parse(raw || '[]');
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change';
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    }));

    res.status(200).json({ message: 'Logged in' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}