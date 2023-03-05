import React, { useState } from 'react';
import { BsLayoutSidebarInset } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { api } from '~/utils/api';
import MockNavigationButton from '../home/mockNavigationButton';
import MockWindowButton, { WindowButtonColour } from '../home/mockWindowButton';
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { MdOutlineContentCopy, MdShortText } from 'react-icons/md';
import { urlPattern } from '~/utils/helper';
import { type Session } from 'next-auth';

type Props = {
  session: Session | null,
  className?: string;
  onSubmitted?: (url: string) => void;
}

const InputBar = (props: Props) => {
  const {
    session,
    className,
    onSubmitted,
  } = props;

  const [urlInput, setUrlInput ] = useState('')
  const [shortenedUrl, setShortenedUrl ] = useState('')
  const [loading, setLoading ] = useState(false)
  const [copied, setCopied ] = useState(false)

  const shortenUrl = api.shortenUrl.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (shortenedUrl) {
      await navigator.clipboard.writeText(`http://${shortenedUrl}`)
      setCopied(true)
      return
    }

    setLoading(true)

    const validity = e.currentTarget.checkValidity()

    if (!validity) {
      setLoading(false)
      return
    }

    const shortUrl = await shortenUrl.mutateAsync({ session, originalUrl: urlInput });

    setShortenedUrl(`tro.hs.vc/${shortUrl.hashUrl as string}`)
    setLoading(false)
    onSubmitted && onSubmitted(shortUrl.hashUrl as string)
  };

  return (
    <div className={`bg-[#c7d1d7] h-14 rounded-xl flex justify-start items-center gap-6 px-2 sm:px-8 ${className || ''}`}>
      <div className="justify-center items-center gap-2 hidden sm:flex">
        <MockWindowButton colour={WindowButtonColour.Red} />
        <MockWindowButton colour={WindowButtonColour.Yellow} />
        <MockWindowButton colour={WindowButtonColour.Green} />
      </div>
      <div className="justify-center items-center gap-2 hidden sm:flex">
        <MockNavigationButton arrow={FiChevronLeft}/>
        <MockNavigationButton arrow={FiChevronRight} />
      </div>
      <div className="flex justify-center items-center gap-2 sm:gap-4 grow">
        <div className="bg-[#f2f2f2] px-1 py-0.5 h-6 rounded">
          <BsLayoutSidebarInset className="text-[#a7a6a7] text-lg" />
        </div>
        <form
          className='grow flex justify-center items-center relative'
          onSubmit={(e) => {
            onSubmit(e).catch((err) => console.error(err))
          }}
          noValidate={!!shortenedUrl}
        >
          <input 
            value={shortenedUrl ? `http:// ${shortenedUrl}` : urlInput}
            onChange={(e) => { 
              setUrlInput(e.target.value)
              if (shortenedUrl) {
                setUrlInput('')
              }
              setShortenedUrl('')
              setCopied(false)
            }}
            className="peer grow h-9 rounded-full bg-white px-2 sm:px-8 focus:outline-none relative"
            placeholder="https://example.com?code=TG9sIHdoeSBkaWQgeW91IHNwZW5kIHRoZSB0aW1lIHRvIGRvIHRoaXM/"
            pattern={urlPattern}
            required
          />
          {shortenedUrl && <p className='absolute left-2 sm:left-8 inset-y-auto text-slate-400'>http://</p>}
          <button 
            className={`
              peer-focus:w-auto 
              peer-focus:px-2
              peer-focus:h-9
              peer-focus:opacity-100 
              peer-focus:ml-2
              focus:w-auto 
              focus:px-2
              focus:h-9
              focus:opacity-100
              focus:ml-2
              w-0
              p-0
              opacity-0 
              bg-[#00aace] 
              text-white 
              rounded-full 
              font-medium
              shrink 
              transition-all 
              overflow-hidden
              ${
                shortenedUrl && 'w-auto px-3 sm:px-4 h-9 opacity-100 flex justify-evenly sm:justify-center items-center gap-2'
              }
            `}
            type="submit"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            {!loading && (shortenedUrl && <MdOutlineContentCopy className='text-xl' />)}
            {!loading && !shortenedUrl && 
              <>
                <MdShortText className='text-xl block sm:hidden' />
                <span className='hidden sm:block'>Shorten!</span>
              </>
            }
            
            {!loading && shortenedUrl && (
              <span className='hidden sm:block'> 
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </span>
              )
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
