'use client'

import Link from 'next/link';
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/sidebarSlice';
import { VscAccount } from "react-icons/vsc";
import { useEffect, useState } from 'react';

export function Sidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const { email } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    dispatch(toggleSidebar());
  }

  return (
    <div className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col justify-between ${isOpen ? 'w-64 p-4' : 'w-0 overflow-hidden py-4'}`}>
      <div>
        <div className="mb-8">
          <BsLayoutTextSidebarReverse 
            className="text-xl cursor-pointer hover:text-gray-300 transition-colors" 
            onClick={handleClick} 
          />
        </div>
        <nav className={`${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Home
              </Link>
            </li>
            <li>
              <Link href="/books" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Books
              </Link>
            </li>
            <li>
              <Link href="/authors" className="block px-4 py-2 hover:bg-gray-700 rounded">
                Authors
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className='flex items-center gap-2 mb-2'>
        <VscAccount className="text-xl cursor-pointer hover:text-gray-300 transition-colors" size={20}/>
        {mounted && email && (
          <p className="text-sm text-gray-300">{email}</p>
        )}
      </div>
    </div>
  );
} 