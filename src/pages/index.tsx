import { GetServerSidePropsContext, InferGetServerSidePropsType, type NextPage } from "next";
import { getServerSession } from "next-auth";
import { getProviders } from "next-auth/react";
import { Montserrat } from 'next/font/google'
import InputBar from "~/components/home/inputBar";
import Layout from "~/components/shared/layout";
import { api } from "~/utils/api";
import { authOptions } from "./api/auth/[...nextauth]";

const montserrat = Montserrat({ subsets: ['latin'] })

const Home = ({ session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const hello = api.shortenUrl.useQuery({ originalUrl: "from tRPC" });

  // console.log(hello)

  return (
    <Layout 
      session={session}
      className="px-8 sm:px-12 relative pt-20 sm:pt-12"
    >
      <h2 className={`${montserrat.className} text-5xl text-[#3e6179] font-semibold leading-snug`}>
        shorten
        <br/>
        your links, 
        <br/>
        <div className="mt-24">
          expand your reach
        </div>
      </h2>

      <InputBar className="absolute inset-x-8 sm:inset-x-12 top-60 sm:top-52 -translate-y-1.5 w-auto" />
    </Layout>
  );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  return {
    props: { session: session },
  }
}

export default Home;
