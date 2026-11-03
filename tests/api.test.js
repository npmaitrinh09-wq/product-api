const BASE = process.env.API_URL || 'http://localhost:3000';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function run() {
  const pid = 9001;

  // Dọn dữ liệu còn sót từ lần chạy trước (bỏ qua kết quả)
  await fetch(`${BASE}/products/${pid}`, { method: 'DELETE' });

  // 1. HEALTH
  let res = await fetch(`${BASE}/health`);
  if (res.status !== 200) throw new Error(`HEALTH failed: ${res.status}`);

  // 2. CREATE
  res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ pid, pname: 'CI Product', price: 100, quantity: 5 }),
  });
  if (res.status !== 201) throw new Error(`CREATE failed: ${res.status}`);

  // 3. READ LIST
  res = await fetch(`${BASE}/products`);
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error('READ LIST failed: not an array');
  if (!list.some((p) => p.pid === pid)) throw new Error('READ LIST failed: created product missing');

  // 4. READ ONE
  res = await fetch(`${BASE}/products/${pid}`);
  const created = await res.json();
  if (created.pname !== 'CI Product') throw new Error('READ ONE failed');
  if (created.price !== 100 || created.quantity !== 5) throw new Error('READ ONE failed: wrong price or quantity');

  // 5. UPDATE
  res = await fetch(`${BASE}/products/${pid}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ quantity: 20 }),
  });
  const updated = await res.json();
  if (updated.quantity !== 20) throw new Error('UPDATE failed');

  // 6. DELETE
  res = await fetch(`${BASE}/products/${pid}`, { method: 'DELETE' });
  if (res.status !== 200) throw new Error(`DELETE failed: ${res.status}`);

  // 7. READ AFTER DELETE (404)
  res = await fetch(`${BASE}/products/${pid}`);
  if (res.status !== 404) throw new Error(`READ AFTER DELETE failed: ${res.status}`);

  // 8. INVALID DATA (400)
  res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ pid: 'abc' }),
  });
  if (res.status !== 400) throw new Error(`INVALID DATA failed: ${res.status}`);

  console.log('API CRUD test passed');
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});