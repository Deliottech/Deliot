import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/');
    } else {
      setError(data?.message || 'Login failed');
    }
  }

  return (
    <div className="center-page">
      <main className="card" style={{ maxWidth: 420, width: '100%' }}>
        <h1>Log in</h1>
        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" className="btn">Log in</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p>No account? <a href="/signup">Sign up</a></p>
      </main>
    </div>
  );
}