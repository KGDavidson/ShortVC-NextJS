import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react"
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { type Session } from "next-auth";

const MyApp: AppType<{session: Session}> = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
};

export default api.withTRPC(MyApp);
