import { type Session } from 'next-auth';
import { Figtree } from 'next/font/google'
import Head from 'next/head';
import Navbar from "./navbar";

const figtree = Figtree({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode,
  session: Session | null,
  className?: string
}

export default function Layout({ children, className, session }: Props) {
  return (
    <>
      <Head>
        <title>sh.ort</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar font={figtree} session={session} />
      <main className={`px-8 sm:px-12 relative ${className || ''}`}>{children}</main>
    </>
  )
}
