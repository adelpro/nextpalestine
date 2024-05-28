import dynamic from 'next/dynamic';

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'APP_NAME';
export default async function Home() {
  const Skeleton = dynamic(() => import('../components/skeleton'), {
    ssr: false,
  });
  const Welcome = dynamic(() => import('../components/welcome'), {
    loading: () => (
      <div>
        <Skeleton />
      </div>
    ),
    ssr: false,
  });
  return <Welcome appName={appName} />;
}
