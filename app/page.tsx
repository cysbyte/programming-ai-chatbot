'use client'

import { useGetBooks } from "@/modules/books/api/use-get-books";
import { Sidebar } from "@/components/Sidebar";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { toggleSidebar } from "@/store/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import InputContainer from "@/components/InputContainer";

export default function Home() {
  const { isLoading, error } = useGetBooks();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col px-4 w-full h-screen">
        <div className="flex items-center justify-between h-16">
          <BsLayoutTextSidebarReverse 
            className={`text-xl cursor-pointer hover:text-gray-300 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} 
            onClick={() => dispatch(toggleSidebar())}
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <InputContainer />
        </div>
      </main>
    </div>
  );
}
