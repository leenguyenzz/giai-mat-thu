import {useState} from 'react'
import decodeTelex from '../library/decodeTelex.js'

function DangCamRanh() {
    const [showHelp, setShowHelp] = useState(false);
    const [key, setKey] = useState('');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState('');
    
    const handleClear = () => {
        // Clear logic here
        setMessage('');
        setKey('');
        setResult('');
    }

    const handleTranslate = () => {
        let translatedMessage = '';
        let news = message.split(/[–-]/).map(part => part.trim());
        const type = news.every(part => key.includes(part[0])) ? 'character' : 'number';
        if(type === 'character') {
            key.split('').forEach(char => {
                const index = news.map(part => part[0]).indexOf(char);
                const item = news.splice(index,1);
                news.push(...item);
            });
            news = news.map(part => part.slice(1));
        }
        else {
            const keySorted = key.split('').sort();
            news = key.split('').map(char => {
                const index = keySorted.indexOf(char);
                keySorted[index] = '-';
                return news[index];
            })
        }
        for(let i = 0; i < news[0].length; i++) {
            for(let j = 0; j < news.length; j++) {
                if(news[j][i]) translatedMessage += news[j][i];
            }
        }
        setResult(translatedMessage);
    }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 transition-all duration-300 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-indigo-600 rounded-full shadow-sm"></div>
                <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Mật Thư Cam Ranh
                </header>
            </div>
            
            {/* Nút bật/tắt hướng dẫn */}
            <button
                onClick={() => setShowHelp(!showHelp)}
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    showHelp 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
                title="Hướng dẫn cách giải"
            >
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
            </button>
        </div>

        {/* Khung nội dung hướng dẫn thả xuống (Dropdown Info) khi được kích hoạt */}
        {showHelp && (
            <div className="mb-6 p-5 bg-slate-50/80 border border-slate-200/60 rounded-3xl text-slate-800 text-sm animate-fadeIn shadow-inner">
                <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-base tracking-tight">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 font-normal">
                        💡
                    </div>
                    Hướng dẫn & Quy luật nhận dạng
                </h4>
                
                <div className="space-y-4">
                    
                    {/* Trường hợp 1: Chữ đối số */}
                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                                Trường hợp 1: Chữ đối số
                            </span>
                        </div>
                        <div className="space-y-1.5 pl-1 text-slate-600 font-medium leading-relaxed">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">✦</span>
                                <span>Bản tin được chia theo từng cụm chữ riêng biệt có số ký tự bằng nhau (hoặc hơn kém nhau tối đa 1 ký tự).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">✦</span>
                                <span>Khóa thường là một từ ngắn gọn (thường là danh từ riêng như: <span className="text-slate-900 font-bold">SIMON, PHAOLO, BENEDISTUS,...</span>).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">✦</span>
                                <span>Số ký tự của từ khóa sẽ bằng đúng với số lượng cụm từ có trong bản tin thô.</span>
                            </div>
                        </div>
                    </div>

                    {/* Đường gạch ngăn mờ */}
                    <div className="border-t border-slate-200/60 my-2"></div>

                    {/* Trường hợp 2: Chữ đối chữ */}
                    <div className="flex flex-col gap-2">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                                Trường hợp 2: Chữ đối chữ
                            </span>
                        </div>
                        <div className="space-y-1.5 pl-1 text-slate-600 font-medium leading-relaxed">
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-0.5">✦</span>
                                <span>Dấu hiệu nhận biết: Ở đầu mỗi đoạn/cụm từ trong bản tin sẽ xuất hiện lần lượt các chữ cái ghép thành từ khóa.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-0.5">✦</span>
                                <span>Cách giải: Tiến hành sắp xếp lại các cụm từ theo đúng trật tự bảng chữ cái (Alphabet) của các chữ cái đầu dòng đó để tìm ra bạch văn.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase pl-1">
                    Khóa (Key)
                </label>
                <textarea 
                    onChange={(e) => setKey(e.target.value)} 
                    value={key} 
                    placeholder="Nhập khóa mã..."
                    className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 min-h-[60px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase pl-1">
                    Bản tin (Mật mã thô)
                </label>
                <textarea 
                    onChange={(e) => setMessage(e.target.value)} 
                    value={message} 
                    placeholder="Nhập bản tin cần giải mã..."
                    className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 min-h-[90px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
            </div>

            <div className="flex flex-col gap-1 bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/50 mt-1">
                <label className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase pl-1">
                    Bạch văn (Kết quả dịch)
                </label>
                <textarea 
                    readOnly 
                    value={result} 
                    placeholder="Kết quả sẽ hiển thị tại đây..."
                    className="w-full bg-transparent border-none p-1 text-lg font-bold text-indigo-950 uppercase outline-none resize-none min-h-[60px]"
                />
            </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-6">
            <button 
                onClick={handleClear} 
                className="w-full py-3.5 px-6 order-2 sm:order-1 border border-slate-200 rounded-2xl text-sm md:text-base font-bold text-slate-700 bg-white shadow-sm transition-all duration-150 cursor-pointer active:bg-slate-50 active:scale-[0.98]"
            >
                Xóa sạch
            </button>
            <button 
                onClick={handleTranslate} 
                className="w-full py-3.5 px-6 order-1 sm:order-2 rounded-2xl text-sm md:text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-100 transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
                Giải mã ngay
            </button>  
        </div>
    </div>
  )
}

export default DangCamRanh