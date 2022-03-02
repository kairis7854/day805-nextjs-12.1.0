import React from 'react'
import Image from 'next/image'
import {
    HomeIcon,
    SearchIcon,
    PlusIcon,
    StarIcon,
} from '@heroicons/react/solid'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useRouter } from "next/router";

function Header() {
    const [session] = useSession();
    const router = useRouter();

    return (
        <header className='sticky bg-[#040714] top-0 z-[1000] flex h-[72px] items-center px-10 md:px-12'>
            <Image
                src='/images/logo.svg'
                width={80}
                height={80}
                className='cursor-pointer'
                onClick={() => { router.push('/') }}
            />
            {
                session && (
                    <div className='hidden ml-10 md:flex items-center space-x-6'>
                        <a className="header-link group">
                            <HomeIcon className="h-4" />
                            <span className="span">Home</span>
                        </a>
                        <a className="header-link group">
                            <SearchIcon className="h-4" />
                            <span className="span">Search</span>
                        </a>
                        <a className="header-link group">
                            <PlusIcon className="h-4" />
                            <span className="span">Watchlist</span>
                        </a>
                        <a className="header-link group">
                            <StarIcon className="h-4" />
                            <span className="span">Originals</span>
                        </a>
                        <a className="header-link group">
                            <img src="/images/movie-icon.svg" alt="" className="h-5" />
                            <span className="span">Movies</span>
                        </a>
                        <a className="header-link group">
                            <img src="/images/series-icon.svg" alt="" className="h-5" />
                            <span className="span">Series</span>
                        </a>
                    </div>
                )
            }
            {
                !session ? (
                    <button
                        className='ml-auto uppercase border px-4 py-1.5 rounded font-[500] tracking-wide hover:bg-white hover:text-black transition duration-200'
                        onClick={signIn}
                    >
                        Login</button>
                ) : (
                    <div className='ml-auto relative h-12 w-12 cursor-pointer' onClick={signOut}>
                        <img src={session.user.image} className="h-12 w-12 rounded-full object-cover " />
                        <div className='absolute text-[12px] bottom-[-3px] left-[50%] translate-x-[-50%] '>SignOut</div>
                    </div>

                )
            }
        </header>
    )
}

export default Header