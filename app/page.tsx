import Image from "next/image";

export default function Home() {
  return (
    <main style={{padding: '50px', textAlign: 'center', backgroundColor: '#f5f5f5'}}>
      <h1 style={{color: '#333', marginBottom: '20px', fontSize: '36px'}}>
        众生皆苦，唯有自渡
      </h1>
      <p style={{maxWidth: '600px', lineHeight: '1.6', fontSize: '18px', margin: 'auto'}}>
        在这个纷扰的世界中，每个生命都会经历各种苦难。认识到这一点，并接受自己的不完美，
        才能通过心灵的成长，找到内在的安宁。
      </p>
      <Image
        src="/meditation.jpg"
        alt="Meditation"
        width={600}
        height={400}
        style={{marginTop: '40px', borderRadius: '8px'}}
      />
    </main>
  );
}