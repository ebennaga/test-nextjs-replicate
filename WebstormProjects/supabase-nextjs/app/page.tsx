'use client';
import { useState } from 'react';

const animals = ['dog', 'cat', 'gorilla'];

export default function Home() {
  const [animal, setAnimal] = useState('');
  const [phrase, setPhrase] = useState('');
  const [images, setImages] = useState<string[]>([]); // History here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!animal || !phrase) {
      setError('Please select an animal and enter a phrase.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animal, phrase }),
      });

      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }

      const data = await res.json();
      const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;

      if (imageUrl) {
        setImages((prev) => [imageUrl, ...prev]); // Add new image to top of history
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error('Generate error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="min-h-screen bg-blue-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl flex flex-col gap-6">
          <div className="flex-1 border border-orange-300 rounded p-4">
            <h1 className="text-orange-500 text-xl font-bold text-center mb-4">Pet Tee Generator</h1>

            <select
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                className={`border w-full p-2 mb-3 bg-white text-black ${
                    !animal && error ? 'border-red-500' : ''
                }`}
            >
              <option value="">Select an animal</option>
              {animals.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
              ))}
            </select>

            <input
                type="text"
                placeholder="Enter phrase for shirt"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                className={`border w-full p-2 mb-3 bg-white text-black ${
                    !phrase && error ? 'border-red-500' : ''
                }`}
            />

            {error && (
                <div className="text-red-600 text-sm mb-3 bg-red-100 px-3 py-2 rounded">
                  {error}
                </div>
            )}

            <button
                onClick={handleGenerate}
                className="bg-orange-500 text-white w-full p-2 mb-4 disabled:opacity-50"
                disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>

            {loading && (
                <div className="w-full aspect-square bg-gray-300 animate-pulse rounded mb-4" />
            )}
          </div>

          {images.length > 0 && (
              <div className="mt-2">
                <h2 className="text-gray-600 font-semibold mb-2">History</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img
                            src={url}
                            alt={`Generated ${i + 1}`}
                            className="rounded shadow hover:opacity-90 transition w-full object-cover aspect-square"
                        />
                      </a>
                  ))}
                </div>
              </div>
          )}
        </div>
      </main>
  );
}
