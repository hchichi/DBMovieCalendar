import useSWR from 'swr';
import Image from 'next/image';

function fetcher(url: string) { 
  return fetch(url).then(res => res.json());
}

export default function Home() {
  const { data: movie, error } = useSWR('/api/movie', fetcher);

  if (error) return <div>加载失败，请检查您的API或网络连接。</div>;
  if (!movie) return <div>数据正在加载中...</div>;

  return (
    <main style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{movie.title}</h1>
      {
        movie.image && <Image src={movie.image} alt={"电影海报"} width={200} height={300} />
      }
      <p>评分: {movie.rating}</p>
      <p>简评: {movie.comment}</p>
      <a href={movie.link} target="_blank" rel="noreferrer">查看详情</a>
    </main>
  );
}