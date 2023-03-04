import { type GetServerSidePropsContext, type InferGetServerSidePropsType, NextPage } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import Layout from "~/components/shared/layout";
import { client } from "~/utils/api";
import { authOptions } from "./api/auth/[...nextauth]";

const HashPage = ({ session }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout session={session}>
      <h2>Requested link not found</h2>
    </Layout>
  );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!context.query.hash) {
    return {
      redirect: {
        source: context.resolvedUrl,
        destination: '/',
        permanent: false,
      },
    }
  }

  const originalUrlRes = await client.getOriginalUrl.query({ hashUrl: context.query.hash as string })

  if (originalUrlRes.originalUrl) {
    const url = originalUrlRes.originalUrl as string

    return {
      redirect: {
        basePath: false,
        source: context.resolvedUrl,
        destination: !url.startsWith('http://') && !url.startsWith('https://') ? 'http://' + url : url,
        permanent: true,
      },
    }
  }
  
  return {
    redirect: {
      source: context.resolvedUrl,
      destination: '/',
      permanent: false,
    },
  }
}


export default HashPage;
