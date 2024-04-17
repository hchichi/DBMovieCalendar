import Image from "next/image";

export default function Home() {
  return (
    <main style={{padding: '50px', textAlign: 'center', backgroundColor: '#1e212d', color: '#c0c5ce'}}>
      <h1 style={{fontStyle: 'italic', marginBottom: '20px', fontSize: '36px', color: '#ff6b6b'}}>
        All beings suffer, self salvation only
      </h1>
      <p style={{maxWidth: '600px', lineHeight: '1.6', fontSize: '18px', margin: 'auto', fontStyle: 'italic'}}>
        In this tumultuous world, every being suffers. Acknowledging this and accepting one's imperfection,
        one can find inner peace through spiritual growth.
      </p>
      <div style={{fontStyle: 'italic', fontSize: '24px', marginTop: '40px'}}>
        <p>众生皆苦，唯有自渡</p>
        <p>All beings suffer, self salvation only</p>
        <p>衆生皆苦、唯有自渡</p>
        <p>shujō kai ku, yuiyū jido</p>
      </div>
      <Image
        src="/meditation.jpg"
        alt="Meditation"
        width={600}
        height={400}
        style={{ borderRadius: '8px'}}
      />
    </main>
  );
}