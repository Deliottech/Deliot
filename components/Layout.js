import Link from 'next/link';

export default function Layout({ children, user }) {
  return (
    <div>
      <header className="site-header">
        <div className="brand">
          <img src="/images/logo.png" alt="DELOIT-TECH" className="logo" />
          <div>
            <h1>DELOIT-TECH</h1>
            <p className="contact">09060571455 • Ezenemebath@gmail.com</p>
          </div>
        </div>
        <nav>
          {user ? (
            <>
              <span className="welcome">Hello, {user.name}</span>
              <a href="/api/auth/logout" onClick={async (e) => {
                e.preventDefault();
                await fetch('/api/auth/logout');
                window.location.href = '/login';
              }} className="btn small">Logout</a>
            </>
          ) : (
            <>
              <Link href="/login"><a className="btn small">Login</a></Link>
              <Link href="/signup"><a className="btn small outline">Sign up</a></Link>
            </>
          )}
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} DELOIT-TECH — Phone accessories</p>
        <p>Contact: 09060571455 • Ezenemebath@gmail.com</p>
      </footer>
    </div>
  );
}