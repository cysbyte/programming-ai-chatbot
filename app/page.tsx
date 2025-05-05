'use client'

import { useGetBooks } from "@/modules/books/api/use-get-books";
import { Sidebar } from "@/components/Sidebar";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { toggleSidebar } from "@/store/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Home() {
  const { data, isLoading, error } = useGetBooks();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 transition-all duration-300">
        <div className="flex items-center justify-between">
          <BsLayoutTextSidebarReverse className={`text-xl cursor-pointer hover:text-gray-300 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} onClick={() => dispatch(toggleSidebar())}/>
        </div>
        {data && <h1 className="text-2xl font-bold">{data}</h1>}
      </main>
    </div>
  );
}
