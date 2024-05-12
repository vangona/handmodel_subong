import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <aside>
        <a>
          <h1>
            멋진 심수연 로고
            <Image
              src='/vercel.svg'
              alt='Vercel Logo'
              className='dark:invert'
              width={100}
              height={24}
              priority
            />
          </h1>
        </a>
        <ul>
          <li>멋진 메뉴1</li>
          <li>멋진 메뉴2</li>
        </ul>
      </aside>
      <section>
        <h2 className='p-4 pt-2'>손모델 심수연</h2>
        <p>멋진 심수연씨 설명</p>
      </section>
    </main>
  );
}
