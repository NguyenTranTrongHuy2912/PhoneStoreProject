import axios from 'axios';

async function check() {
  const res = await axios.get('http://localhost:5000/api/products');
  console.log(`Total count: ${res.data.count}`);
  console.log(`Data length: ${res.data.data.length}`);
}

check();
