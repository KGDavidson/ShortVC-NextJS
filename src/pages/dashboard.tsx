import { type InferGetServerSidePropsType, type GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';
import UserUrl from '~/components/dashboard/userUrl';
import InputBar from '~/components/shared/inputBar';
import Layout from '~/components/shared/layout';
import { api, client } from '~/utils/api';
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { authOptions } from './api/auth/[...nextauth]';

type ShortenedUrl = {
  hash: string,
  url_original: string,
  user_id: string,
}

const Dashboard = ({ session, userShortenedUrls: initialShortenedUrls }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: userShortenedUrlsData, isLoading, refetch: refetchUserShortenedUrls } = api.getUserShortenedUrls.useQuery({ session }, { initialData: initialShortenedUrls });
  const updateUserShortenedUrl = api.updateUserShortenedUrl.useMutation({
    onSuccess: () => refetchUserShortenedUrls(),
  });
  const deleteUserShortenedUrl = api.deleteUserShortenedUrl.useMutation({
    onSuccess: () => refetchUserShortenedUrls(),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { shortenedUrls = [] }: { shortenedUrls?: ShortenedUrl[] } = userShortenedUrlsData || {};

  return (
    <Layout
      className='flex flex-col gap-1 py-8 sm:py-12 '
      session={session}
    >
      <InputBar 
        session={session}
        onSubmitted={() => void refetchUserShortenedUrls()}
        className='mb-3'
      />
      {(isLoading) && (
        <span className='flex items-center justify-center'>
          <AiOutlineLoading3Quarters className='text-4xl text-[#3e6179] animate-spin' />
        </span>
      )}

      {!isLoading && shortenedUrls.map((url) => (
        <UserUrl 
          key={url.hash}
          url={url} 
          onDelete={() => deleteUserShortenedUrl.mutate({ session, hashUrl: url.hash })}
          onSave={async (newUrl: string) => {
            await updateUserShortenedUrl.mutateAsync({session, hashUrl: url.hash, newUrl})
          }}
        />
      ))}
    </Layout>
  );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        source: context.resolvedUrl,
        destination: '/',
        permanent: false,
      },
    }
  }

  const userShortenedUrls: {
    shortenedUrls?: ShortenedUrl[]
  } = await client.getUserShortenedUrls.query({ session: session })

  
  return {
    props: { 
      session,
      userShortenedUrls
    },
  }
}


export default Dashboard;
