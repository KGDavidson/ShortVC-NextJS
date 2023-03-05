import React, { useState } from 'react';
import {FaSave, FaTrash} from 'react-icons/fa'
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import { urlPattern } from '~/utils/helper';

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
      className="rounded-lg flex flex-col sm:flex-row justify-center items-stretch gap-2 sm:gap-4 py-3 px-2 sm:px-4"
      key={url.hash}
      onSubmit={(e) => {
        onSubmit(e).catch((err) => console.error(err))
      }}
      noValidate={!redirectUrl}
    >
      <span className="flex sm:grow items-center gap-2">
        <input
          className="w-full px-2 sm:px-4 py-1 rounded-full bg-white focus:outline-none" 
          onKeyDown={(e) => { !redirectUrl && e.key === 'Enter' && e.preventDefault(); }}
          placeholder={url.url_original}
          value={redirectUrl}
          onChange={({target}) => setRedirectUrl(target.value)}
          pattern={urlPattern}
        />
        <input 
          className="w-20 px-2 sm:px-4 py-1 rounded-md bg-white focus:outline-none text-slate-500" 
          value={url.hash} 
          disabled
        />
      </span>
      <button
        type='submit'
        className={`sm:w-28 py-1 flex justify-center items-center transition-all rounded-lg text-slate-800 font-bold ${redirectUrl ? 'bg-emerald-400' : 'bg-red-400'}`}
      >
        <Icon className={`inline-block mr-2 ${loading ? 'animate-spin' : ''}`} />
        {redirectUrl ? 'Save' : 'Delete'}
      </button>
    </form>
  );
};

export default UserUrl;
