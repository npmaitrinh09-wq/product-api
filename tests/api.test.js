const BASE = process.env.API_URL || 'http://localhost:3000';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function run() {
  const pid = 9001;

  let res = await fetch(`${BASE}/health`);
  if (res.status !== 200) throw new Error(`Health check failed: ${res.status}`);

  res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ pid, pname: 'CI Product', price: 100, quantity: 5 }),
  });
  if (res.status !== 201) throw new Error(`POST failed: ${res.status}`);

  res = await fetch(`${BASE}/products/${pid}`);
  const created = await res.json();
  if (created.pname !== 'CI Product') throw new Error('GET failed');

  res = await fetch(`${BASE}/products/${pid}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ quantity: 20 }),
  });
  const updated = await res.json();
  if (updated.quantity !== 20) throw new Error('PUT failed');

  res = await fetch(`${BASE}/products/${pid}`, { method: 'DELETE' });
  if (res.status !== 200) throw new Error(`DELETE failed: ${res.status}`);

  res = await fetch(`${BASE}/products/${pid}`);
  if (res.status !== 404) throw new Error('Product should be gone after DELETE');

  console.log('API CRUD test passed');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});