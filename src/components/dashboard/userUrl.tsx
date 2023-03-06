import React, { useState } from 'react';
import {FaSave, FaTrash} from 'react-icons/fa'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { urlPattern } from '~/utils/helper';
import {MdOutlineContentCopy} from 'react-icons/md';

type Props = {
  url: {
    hash: string,
    url_original: string,
    user_id: string,
  }
  onDelete: () => void;
  onSave: (newUrl: string) => Promise<void>;
}

const UserUrl = (props: Props) => {
  const  {url, onSave, onDelete } = props;

  const [ redirectUrl, setRedirectUrl ] = useState('')
  const [loading, setLoading ] = useState(false)

  const Icon = loading ? AiOutlineLoading3Quarters : redirectUrl ? FaSave : FaTrash

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    if (!redirectUrl) {
      onDelete()
    } else {
      const validity = e.currentTarget.checkValidity()

      if (!validity) {
        setLoading(false)
        return
      }
      
      await onSave(redirectUrl)

      setLoading(false)
      setRedirectUrl('')
    }
  }

  return (
    <form
      className="rounded-lg flex flex-col sm:flex-row justify-center items-stretch gap-2 sm:gap-4 py-1 px-2 sm:px-4"
      key={url.hash}
      onSubmit={(e) => {
        onSubmit(e).catch((err) => console.error(err))
      }}
      noValidate={!redirectUrl}
    >
      <span className="flex sm:grow items-center gap-2">
        <div className='w-full'>
          <label className='ml-2 text-[10px]'>ORIGINAL URL</label>
          <input
            className="w-full px-2 sm:px-4 py-1 mt-1 rounded-full bg-white focus:outline-none" 
            onKeyDown={(e) => { !redirectUrl && e.key === 'Enter' && e.preventDefault(); }}
            placeholder={url.url_original}
            value={redirectUrl}
            onChange={({target}) => setRedirectUrl(target.value)}
            pattern={urlPattern}
          />
        </div>
        <div className='w-20 sm:w-auto'>
          <label className='ml-2 text-[10px]'>SHORT URL</label>
          <button
            type='button' 
            className="w-20 sm:w-auto px-2 sm:px-4 py-1 mt-1 h-full rounded-lg bg-white focus:outline-none text-slate-500 flex justify-center items-center" 
            onClick={() => void navigator.clipboard.writeText(`http://tro.hs.vc/${url.hash}`)}
          >
            {/* <span className='hidden sm:inline-block'>Copy</span> */}
            <span className='hidden sm:inline-block'>http://tro.hs.vc/</span>
            {url.hash}
            <MdOutlineContentCopy className="inline-block ml-1 sm:ml-2" />
          </button>
        </div>
      </span>
      <div>
        <label className='hidden invisible sm:inline-block ml-2 text-[10px]'>{redirectUrl ? 'Save' : 'Delete'}</label>
        <button
          type='submit'
          className={`w-full sm:w-24 py-0.5 flex justify-center mt-0.5 sm:mt-[0.3225rem] items-center transition-all rounded-lg text-slate-800 font-semibold ${redirectUrl ? 'bg-emerald-400' : 'bg-red-400'}`}
        >
          <Icon className={`inline-block mr-2 ${loading ? 'animate-spin' : ''}`} />
          {redirectUrl ? 'Save' : 'Delete'}
        </button>
      </div>
    </form>
  );
};

export default UserUrl;
