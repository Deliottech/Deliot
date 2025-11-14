import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/login');
    } else {
      setError(data?.message || 'Signup failed');
    }
  }

  return (
    <div className="center-page">
      <main className="card" style={{ maxWidth: 420, width: '100%' }}>
        <h1>Sign up</h1>
        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="btn">Create account</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>Already have an account? <a href="/login">Log in</a></p>
      </main>
    </div>
  );
}