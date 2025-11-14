import fs from 'fs';
import path from 'path';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

export default function Home({ user, products }) {
  return (
    <Layout user={user}>
      <div className="market">
        <h2>Market — iPhones & Accessories</h2>
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token || null;
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change';
  try {
    if (!token) throw new Error('Not authenticated');
    const decoded = jwt.verify(token, JWT_SECRET);
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersRaw = fs.existsSync(usersPath) ? fs.readFileSync(usersPath) : '[]';
    const users = JSON.parse(usersRaw);
    const user = users.find(u => u.email === decoded.email) || null;

    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsRaw = fs.existsSync(productsPath) ? fs.readFileSync(productsPath) : '[]';
    const products = JSON.parse(productsRaw);

    if (!user) {
      return {
        redirect: { destination: '/login', permanent: false }
      };
    }

    return { props: { user: { name: user.name, email: user.email }, products } };
  } catch (err) {
    return {
      redirect: { destination: '/login', permanent: false }
    };
  }
}