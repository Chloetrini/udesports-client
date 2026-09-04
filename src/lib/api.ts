const BASE_URL = import.meta.env.BASE_URL || '';

export async function fetchData() {
  const res = await fetch(`${BASE_URL}data/data.json`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}