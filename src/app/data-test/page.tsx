'use client';

import { useState, useEffect } from 'react';

export default function DataTestPage() {
  const [status, setStatus] = useState('Loading...');
  const [dataCount, setDataCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/comprehensive_loads_data.json');
        if (response.ok) {
          const data = await response.json();
          setDataCount(data.length);
          setStatus(`Success: Loaded ${data.length} items`);
        } else {
          setStatus(`Failed: ${response.status}`);
        }
      } catch (err) {
        setStatus(`Error: ${err}`);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Test</h1>
      <p>Status: {status}</p>
      <p>Count: {dataCount}</p>
    </div>
  );
}
