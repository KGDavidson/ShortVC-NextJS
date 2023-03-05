import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { Montserrat } from 'next/font/google'
import InputBar from "~/components/shared/inputBar";
import Layout from "~/components/shared/layout";
import { authOptions } from "./api/auth/[...nextauth]";

const montserrat = Montserrat({ subsets: ['latin'] })

const Home = ({ session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout 
      session={session}
      className="pt-24 sm:pt-16"
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

      <InputBar className="absolute inset-x-8 sm:inset-x-12 top-64 sm:top-56 -translate-y-1.5 w-auto" session={session} />
    </Layout>
  );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  return {
    props: { session },
  }
}

export default Home;
