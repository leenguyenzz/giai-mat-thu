import React, { useState, useEffect, useRef } from 'react'

export default function Morse(){
    const [morseCode, setMorseCode] = useState('');
    const [text, setText] = useState('');
    const handleDot = () => {
        setMorseCode(prevMorseCode => prevMorseCode + '.');
    };

    const handleDash = () => {
        setMorseCode(prevMorseCode => prevMorseCode + '-');
    };

    const handleSpace = () => {
        setMorseCode(prevMorseCode => prevMorseCode + ' ');
    };

    const handleSlash = () => {
        setMorseCode(prevMorseCode => prevMorseCode + ' / ');
    };

    const handleClear = () => {
        setMorseCode('');
        setText('');
    };

    const handleTranslate = () => {
        // Logic for translating morseCode to text
        const morseToTextMap = {
            '.-': 'A',
            '-...': 'B',
            '-.-.': 'C',
            '-..': 'D',
            '.': 'E',
            '..-.': 'F',
            '--.': 'G',
            '....': 'H',
            '..': 'I',
            '.---': 'J',
            '-.-': 'K',
            '.-..': 'L',
            '--': 'M',
            '-.': 'N',
            '---': 'O',
            '.--.': 'P',
            '--.-': 'Q',
            '.-.': 'R',
            '...': 'S',
            '-': 'T',
            '..-': 'U',
            '...-': 'V',
            '.--': 'W',
            '-..-': 'X',
            '-.--': 'Y',
            '--..': 'Z',
            '.----': '1',
            '..---': '2',
            '...--': '3',
            '....-': '4',
            '.....': '5',
            '-....': '6',
            '--...': '7',
            '---..': '8',
            '----.': '9',
            '-----': '0',
            '/': ' ' // Space separator
        };
        const words = morseCode.split(' / ');
        const translatedWords = words.map(word => {
            const letters = word.split(' ');
            return letters.map(letter => morseToTextMap[letter] || '').join('');
        });
        const result = translatedWords.join(' ');
        setText(result);
    };
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 pb-3">
            <div className="w-1.5 h-5 bg-amber-500 rounded-full shadow-sm"></div>
            <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Morse Code Translator
            </header>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase pl-1">
                Mã Morse Đang Nhập (Morse Input)
            </label>
            <textarea
                readOnly
                value={morseCode}
                placeholder="Bấm các nút bên dưới để gõ ký tự..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-lg font-mono font-bold text-amber-600 shadow-sm outline-none resize-none min-h-[60px] text-center tracking-widest"
            />
            </div>

            {/* Bàn phím gõ Morse: Mobile chia làm 2x2 nút to, Laptop tự xếp thành 1 hàng 4 nút */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
            <button
                onClick={handleDot}
                className="py-4 rounded-xl text-lg font-black text-slate-800 bg-slate-100/80 border border-slate-200 shadow-sm transition-all duration-100 cursor-pointer active:bg-amber-500 active:text-white active:border-amber-500"
            >
                Dot ( . )
            </button>
            <button
                onClick={handleDash}
                className="py-4 rounded-xl text-lg font-black text-slate-800 bg-slate-100/80 border border-slate-200 shadow-sm transition-all duration-100 cursor-pointer active:bg-amber-500 active:text-white active:border-amber-500"
            >
                Dash ( - )
            </button>
            <button
                onClick={handleSpace}
                className="py-3.5 rounded-xl text-xs md:text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 shadow-sm cursor-pointer active:bg-slate-100"
            >
                Dấu Cách
            </button>
            <button
                onClick={handleSlash}
                className="py-3.5 rounded-xl text-xs md:text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 shadow-sm cursor-pointer active:bg-slate-100"
            >
                Dấu /
            </button>
            </div>

            <div className="flex flex-col gap-1 mt-1 rounded-2xl border border-amber-100 p-3.5" style={{ backgroundColor: 'rgba(245, 158, 11, 0.04)' }}>
            <label className="text-[11px] font-bold text-amber-800 tracking-wider uppercase pl-1">
                Bạch văn (Text Output)
            </label>
            <textarea
                readOnly
                value={text}
                placeholder="Văn bản dịch ngược sẽ xuất hiện ở đây..."
                className="w-full bg-transparent border-none p-1 text-lg font-bold text-slate-900 outline-none resize-none min-h-[60px]"
            />
            </div>
        </div>

        {/* System Buttons */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-6">
            <button
            onClick={handleClear}
            className="w-full py-3.5 px-6 order-2 sm:order-1 border border-slate-200 rounded-2xl text-sm md:text-base font-bold text-slate-700 bg-white shadow-sm transition-all duration-150 cursor-pointer active:bg-slate-50 active:scale-[0.98]"
            >
            Xóa sạch
            </button>
            <button
            onClick={handleTranslate}
            className="w-full py-3.5 px-6 order-1 sm:order-2 rounded-2xl text-sm md:text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-100 transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
            Dịch mật mã
            </button>
        </div>
    </div>
  )
}