import React, { useRef, useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { IoPlayOutline } from "react-icons/io5";
import { CiStop1 } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addImage,
  removeImage,
  setUserInput,
  clearImages,
} from "@/store/conversationSlice";
import Image from "next/image";

const InputContainer = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.conversation.images);
  const [error, setError] = useState<string>("");
  const userInput = useSelector(
    (state: RootState) => state.conversation.userInput
  );

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 5 * 24); // 24px per line, max 5 lines
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const handleUpload = () => {
    if (images.length >= 3) {
      setError("Maximum 3 images allowed");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setUserInput(e.target.value));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (images.length >= 3) {
        setError("Maximum 3 images allowed");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        dispatch(addImage(base64String));
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStart = async () => {
    try {
      // Validate user input
      if (!userInput.trim()) {
        setError("Please enter a message");
        return;
      }

      console.log("Starting conversation with:", { userInput, images });

      const formData = new FormData();
      formData.append("userInput", userInput);
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create conversation");
      }

      const data = await response.json();
      console.log("Conversation created successfully:", data);

      // Clear the form after successful submission
      dispatch(setUserInput(""));
      dispatch(clearImages());
      setError("");
    } catch (error) {
      console.error("Error creating conversation:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create conversation"
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full h-full pb-40">
      <h1 className="text-5xl font-normal">See it, ship it</h1>
      <p className="text-gray-500 w-[600px] text-center">
        Design, build, and deploy beautiful fullstack web apps on autopilot.
        Prompt a single URL to get started.
      </p>
      <div className="flex flex-col items-center justify-center w-[450px] md:w-[600px] lg:w-[800px] border border-gray-300 rounded-3xl p-2 bg-gray-100 shadow-md">
        <textarea
          ref={textareaRef}
          placeholder="Ask me anything..."
          className="w-full p-2 rounded-md outline-none resize-none overflow-hidden"
          rows={1}
          onInput={adjustTextareaHeight}
          style={{ minHeight: "24px", maxHeight: "120px" }}
          value={userInput}
          onChange={handleChange}
        />
        <div className="flex items-center justify-between gap-2 w-full mt-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              className="flex items-center justify-center w-9 h-9 bg-white rounded-full border border-gray-300 cursor-pointer hover:bg-gray-200 transition-all duration-300"
              onClick={handleUpload}
            >
              <FiUpload className="text-gray-500 text-xl" size={20} />
            </div>
            {images.length > 0 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="w-10 h-8 rounded-full overflow-hidden">
                      <Image
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() => {
                        dispatch(removeImage(index));
                        setError("");
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 cursor-pointer bg-gray-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <div
              className="flex items-center justify-center w-9 h-9 bg-white rounded-full border border-gray-300 cursor-pointer hover:bg-gray-200 transition-all duration-300"
              onClick={handleStart}
            >
              <IoPlayOutline className="text-gray-500 text-xl" size={20} />
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-white rounded-full border border-gray-300 cursor-pointer hover:bg-gray-200 transition-all duration-300">
              <CiStop1 className="text-gray-500 text-xl" size={18} />
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2 animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputContainer;
