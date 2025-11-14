export default function ProductCard({ product }) {
  return (
    <div className="card product">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.category}</p>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>₦{product.price}</strong>
          <button className="btn small orange">Add to cart</button>
        </div>
      </div>
    </div>
  );
}