import Image from "next/image";
import useSWR from 'swr';

function fetcher(url) {
  return fetch(url).then(res => res.json());
}

export default function Home() {
  const { data: movie, error } = useSWR('/api/movie', fetcher);

  if (error) return <div>加载失败</div>;
  if (!movie) return <div>加载中...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image
        src={movie.image}
        alt={'电影海报'}
        width={260}
        height={400}
        className="rounded-lg"
      />
      <h1 className="text-2xl text-blue-800 mt-4">{movie.title}</h1>
      <p className="text-gray-600">{movie.comment}</p>
    </main>
  );
}