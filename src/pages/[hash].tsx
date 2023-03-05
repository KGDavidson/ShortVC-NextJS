import { type GetServerSidePropsContext } from "next";
import { client } from "~/utils/api";

const HashPage = () => (null);

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
