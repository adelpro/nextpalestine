import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/header';

import ReactQueryWrapper from '../components/reactQueryWrapper';
import './globals.css';

import RecoilProviderWrapper from '@/components/recoilProviderWrapperx';
import RouteGuardWrapper from '@/components/routeGuardWrapper';
import { ViewTransitions } from 'next-view-transitions';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  ),
  manifest: '/manifest.json',
};
export const viewport = {
  width: 1,
  themeColor: 'dark',
};
type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <ViewTransitions>
      <html lang="en">
        <Script
          src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          strategy="lazyOnload"
        />
        <body>
          <RecoilProviderWrapper>
            <ReactQueryWrapper>
              <RouteGuardWrapper>
                <NextTopLoader color="#2363eb" showSpinner={false} />
                <Header />
                {children}
                <Toaster />
              </RouteGuardWrapper>
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
            </ReactQueryWrapper>
          </RecoilProviderWrapper>
        </body>
      </html>
    </ViewTransitions>
  );
}
