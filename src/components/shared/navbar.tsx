import { signIn, signOut } from 'next-auth/react';
import { type NextFont } from 'next/dist/compiled/@next/font';
import React, { useState } from 'react';
import NavbarLink from '../home/navbarLink';
import { FaGithub } from 'react-icons/fa'
import { type Session } from 'next-auth';
import { BiMenu, BiMenuAltRight } from 'react-icons/bi'
import Link from 'next/link';

type Props = {
  font: NextFont;
  session: Session | null;
}

const Navbar = ({
  font,
  session
}: Props) => {
  const [menuOpen, setMenuOpen ] = useState(false)

  const MenuIcon = menuOpen ? BiMenuAltRight : BiMenu

  return (
    <nav className="px-8 sm:px-12 pt-8 pb-2 sm:py-8 w-full flex gap-4 justify-center items-start flex-col relative sm:flex-row">
      <div className='flex justify-between items-center w-full'>
        <Link href="/">
          <h1 className={`${font.className} text-[#ff0039] font-bold text-4xl`}>
            tro.hs.vc
          </h1>
        </Link>
        <MenuIcon 
          className={`text-4xl text-[#536c7b] sm:hidden`} 
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>
      <div className={`
        flex 
        justify-end 
        py-2
        sm:w-full 
        px-8 
        sm:px-0 
        gap-2 
        sm:gap-4 
        items-center 
        overflow-hidden 
        absolute 
        sm:static 
        inset-x-0 
        top-full 
        transition-all 
        sm:max-h-10
        sm:opacity-100
        bg-[#ebf0f3]
        sm:z-10
        ${menuOpen ? 'max-h-14 opacity-100 z-10' : 'max-h-0 opacity-0 -z-10'}
      `}>
        {session ? (
          <>
            <NavbarLink
              content="Log Out"
              onClick={() => {signOut().catch((err) => console.error(err))}}
              className="bg-transparent text-[#536c7b] hover:text-[#010202] transition-all px-2 py-1 sm:px-4 sm:py-2"
            />
            <NavbarLink
              content="Dashboard"
              path="/dashboard"
              className="bg-[#536c7b] text-white hover:bg-[#3f5461] transition-all px-2 py-1 sm:px-4 sm:py-2"
            />
          </>
        ) : (
          <NavbarLink 
            className="bg-[#536c7b] text-white hover:bg-[#3f5461] transition-all px-2 py-1 sm:px-4 sm:py-2 flex items-center justify-center gap-4"
            content={<>
              <FaGithub className="text-white text-2xl" />
              Login with Github
            </>}
            onClick={() => {signIn('github').catch((err) => console.error(err))}}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
