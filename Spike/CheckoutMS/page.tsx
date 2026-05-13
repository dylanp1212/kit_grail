const testItems = [
  {id: '1', title: '2014 Argentina Messi Jersey', price: 300, size: 'L'},
  {id: '2', title: '2006 Italy Home Jersey', price: 134, size: 'M'},
  {id: '3', title: '2008 Manchester United Ronaldo Jersey', price: 164, size: 'L'},
]

export default function CheckoutPage() {
  const total = testItems.reduce((sum, item) => sum + item.price, 0)
  return (
    <div>
      <h2>Your Cart</h2>
      {testItems.map(item => (
        <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ccc'}}>
          <span>{item.title} — Size {item.size}</span>
          <span>${item.price}</span>
        </div>
      ))}
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 'bold'}}>
        <span>Total</span>
        <span>${total}</span>
      </div>
      <a href="https://buy.stripe.com/fZu6oHglG6Dab0F0mogMw00">
        <button>Proceed to Checkout</button>
      </a>
    </div>
  )
}
