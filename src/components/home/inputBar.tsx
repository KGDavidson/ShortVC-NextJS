import { useQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { BsLayoutSidebarInset } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { api } from '~/utils/api';
import MockNavigationButton from './mockNavigationButton';
import MockWindowButton, { WindowButtonColour } from './mockWindowButton';

type Props = {
  className?: string;
}

const InputBar = (props: Props) => {
  const {
    className
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const shortenUrl = api.shortenUrl.useMutation();
  // const {data, refetch, error} = t
  // const { data, error } = useQuery("comments", fetchComments, {
  //   enabled: false
  // });

  // console.log('hello', t)
  // console.log('hello', error)
  // console.log('hello', data)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validity = e.currentTarget.checkValidity()

    if (!validity) return

    const shortenedUrl = await shortenUrl.mutateAsync({ originalUrl: inputRef.current?.value! });

    if (!inputRef.current) return

    inputRef.current.value = `https://tro.hs.vs/${shortenedUrl.hashUrl}`;
  };

  return (
    <div className={`bg-[#c7d1d7] h-14 rounded-xl flex justify-start items-center gap-6 px-4 sm:px-8 ${className}`}>
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
          className='grow flex justify-center items-center'
          onSubmit={onSubmit}
        >
          <input 
            // initialValue="http://example.com"
            className="peer grow h-9 rounded-full bg-white px-2 sm:px-8 focus:outline-none"
            placeholder="https://example.com?code=TG9sIHdoeSBkaWQgeW91IHNwZW5kIHRoZSB0aW1lIHRvIGRvIHRoaXM/"
            pattern="(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})"
            ref={inputRef}
            required
          />
          <button 
            className={`
              peer-focus:w-auto 
              peer-focus:px-4 
              peer-focus:py-2 
              peer-focus:opacity-100 
              focus:w-auto 
              focus:px-4 
              focus:py-2 
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
            `}
            type="submit"
          >
            Shorten!
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
