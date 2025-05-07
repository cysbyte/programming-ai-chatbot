"use client";

import { Sidebar } from "@/components/Sidebar";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { toggleSidebarForConversation } from "@/store/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import InputContainer from "@/components/InputContainer";

export default function Home() {
  // const { isLoading, error } = useGetBooks();
  const dispatch = useDispatch();
  const isOpenForConversation = useSelector(
    (state: RootState) => state.sidebar.isOpenForConversation
  );
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar
        isOpen={isOpenForConversation}
        handleClick={() => dispatch(toggleSidebarForConversation())}
      />
      <main className="flex-1 flex flex-col justify-between items-center px-4 w-full pb-4">
        <div className="flex items-center justify-start h-16 w-full">
          <BsLayoutTextSidebarReverse
            className={`text-xl cursor-pointer hover:text-gray-300 transition-all duration-300 ${
              isOpenForConversation ? "opacity-0" : "opacity-100"
            }`}
            onClick={() => dispatch(toggleSidebarForConversation())}
          />
        </div>
        <InputContainer />
      </main>
    </div>
  );
}
