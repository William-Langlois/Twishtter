// _app.tsx

/*
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
*/

// 1. import `NextUIProvider` component
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }) {
  return (
    // 2. Use at the root of your app
      <SessionProvider session={pageProps.session}>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </SessionProvider>
  );
}

export default MyApp;


