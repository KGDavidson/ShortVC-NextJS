import React, { useRef, useState } from 'react';
import { BsLayoutSidebarInset } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { api } from '~/utils/api';
import MockNavigationButton from './mockNavigationButton';
import MockWindowButton, { WindowButtonColour } from './mockWindowButton';
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { MdOutlineContentCopy } from 'react-icons/md';

type Props = {
  className?: string;
}

const InputBar = (props: Props) => {
  const {
    className
  } = props;

  const [urlInput, setUrlInput ] = useState('')
  const [shortenedUrl, setShortenedUrl ] = useState('')
  const [loading, setLoading ] = useState(false)
  const [copied, setCopied ] = useState(false)


  const shortenUrl = api.shortenUrl.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (shortenedUrl) {
      await navigator.clipboard.writeText(shortenedUrl)
      setCopied(true)
      return
    }

    setLoading(true)

    const validity = e.currentTarget.checkValidity()

    if (!validity) {
      setLoading(false)
      return
    }

    const shortUrl = await shortenUrl.mutateAsync({ originalUrl: urlInput });

    setShortenedUrl(`tro.hs.vs/${shortUrl.hashUrl as string}`)
    setLoading(false)
  };

  return (
    <div className={`bg-[#c7d1d7] h-14 rounded-xl flex justify-start items-center gap-6 px-4 sm:px-8 ${className || ''}`}>
      <div className="justify-center items-center gap-2 hidden sm:flex">
        <MockWindowButton colour={WindowButtonColour.Red} />
        <MockWindowButton colour={WindowButtonColour.Yellow} />
        <MockWindowButton colour={WindowButtonColour.Green} />
      </div>
      <div className="justify-center items-center gap-2 hidden sm:flex">
        <MockNavigationButton arrow={FiChevronLeft}/>
        <MockNavigationButton arrow={FiChevronRight} />
      </div>
      <div className="flex justify-center items-center gap-4 grow">
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
            value={shortenedUrl ? `https:// ${shortenedUrl}` : urlInput}//shortenedUrl ? `https:// ${shortenedUrl}` : undefined}
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
            pattern="^(?:(?:https?://)?(?:www\.)?)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\w\/]*)*$"
            // ref={inputRef}
            required
          />
          {shortenedUrl && <p className='absolute left-2 sm:left-8 inset-y-auto text-slate-400'>https://</p>}
          <button 
            className={`
              peer-focus:w-auto 
              peer-focus:px-4 
              peer-focus:h-9
              peer-focus:opacity-100 
              focus:w-auto 
              focus:px-4 
              focus:h-9
              focus:opacity-100 
              w-0 
              p-0 
              opacity-0 
              bg-[#00aace] 
              text-white 
              rounded-full 
              font-medium 
              ml-2 
              shrink 
              transition-all 
              overflow-hidden
              ${
                shortenedUrl && 'w-auto px-4 h-9 opacity-100 flex justify-center items-center gap-2'
              }
            `}
            type="submit"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            {!loading && (shortenedUrl && <MdOutlineContentCopy className='text-xl' />)}
            {!loading && !shortenedUrl && 'Shorten!'}
            {!loading && shortenedUrl && (copied ? 'Copied!' : 'Copy to clipboard')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
