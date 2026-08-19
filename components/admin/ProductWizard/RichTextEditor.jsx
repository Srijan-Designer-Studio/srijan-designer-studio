"use client";

import { useRef, useEffect, useState } from "react";
import { Bold, Italic, Underline, AlignLeft, List } from "lucide-react";

export default function RichTextEditor({ label, placeholder, value, onChange }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false, italic: false, underline: false, justifyLeft: false, insertUnorderedList: false,
  });

  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    } else if (editorRef.current && editorRef.current.innerHTML === "" && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
    });
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
    checkFormats();
  };

  const format = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) editorRef.current.focus();
    handleInput();
  };

  return (
    <div className="mb-6 text-black">
      <label className="block text-[13px] font-bold text-gray-800 mb-2">{label}</label>
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-gray-200 bg-gray-50/80 text-gray-600">
          <select 
            onChange={(e) => { if (e.target.value) format('formatBlock', e.target.value); e.target.value = ''; }} 
            className="text-xs bg-transparent outline-none font-bold px-1 py-1 cursor-pointer"
          >
            <option value="">Paragraph</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
          </select>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button type="button" onClick={() => format('bold')} className={`p-1.5 rounded cursor-pointer ${activeFormats.bold ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><Bold size={14} /></button>
          <button type="button" onClick={() => format('italic')} className={`p-1.5 rounded cursor-pointer ${activeFormats.italic ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><Italic size={14} /></button>
          <button type="button" onClick={() => format('underline')} className={`p-1.5 rounded cursor-pointer ${activeFormats.underline ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><Underline size={14} /></button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button type="button" onClick={() => format('justifyLeft')} className={`p-1.5 rounded cursor-pointer ${activeFormats.justifyLeft ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><AlignLeft size={14} /></button>
          <button type="button" onClick={() => format('insertUnorderedList')} className={`p-1.5 rounded cursor-pointer ${activeFormats.insertUnorderedList ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><List size={14} /></button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onKeyUp={checkFormats}
          onMouseUp={checkFormats}
          placeholder={placeholder}
          className="w-full min-h-[150px] max-h-[400px] overflow-y-auto text-sm px-4 py-4 outline-none focus:ring-0 prose prose-sm max-w-none empty:before:content-[attr(placeholder)] empty:before:text-gray-400"
        />
      </div>
    </div>
  );
}