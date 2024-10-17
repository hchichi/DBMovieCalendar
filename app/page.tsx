'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 你可以根据需要更改调用的 API 端点参数
      const response = await fetch(`/api/country?name=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-8 font-quingke">
        时不我待
      </h1>
      
      <div className="w-full max-w-md">
        <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="输入国家名称"
            aria-label="Country Name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
            onClick={handleSearch}
          >
            搜索
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-4">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}

      {result && (
        <div className="mt-8 max-w-lg bg-white rounded-lg shadow-md p-6">
          {Array.isArray(result) ? result.map((country: any) => (
            <div key={country.alpha3Code} className="mb-4">
              <h2 className="text-2xl font-bold">{country.name}</h2>
              <p><strong>首都:</strong> {country.capital}</p>
              <p><strong>区域:</strong> {country.region}</p>
              <p><strong>人口:</strong> {country.population.toLocaleString()}</p>
              <p><strong>货币:</strong> {country.currencies.map((curr: any) => curr.name).join(', ')}</p>
              <p><strong>语言:</strong> {country.languages.map((lang: any) => lang.name).join(', ')}</p>
            </div>
          )) : (
            <div>
              <h2 className="text-2xl font-bold">{result.name}</h2>
              <p><strong>首都:</strong> {result.capital}</p>
              <p><strong>区域:</strong> {result.region}</p>
              <p><strong>人口:</strong> {result.population.toLocaleString()}</p>
              <p><strong>货币:</strong> {result.currencies.map((curr: any) => curr.name).join(', ')}</p>
              <p><strong>语言:</strong> {result.languages.map((lang: any) => lang.name).join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
