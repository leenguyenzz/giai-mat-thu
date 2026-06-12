import {useState} from 'react'
import decodeTelex from '../library/decodeTelex.js'

function DangMaPhuong() {
  const [showHelp, setShowHelp] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState('');
  
  const mapping = ['N','J','A','V','R','T','K','G','C','X','U','Q','M','I','E','B','W','S','O','F','H','D','Y','P','L']
  const handleClear = () => {
    // Clear logic here
    setMessage('');
    setResult('');
  }

  const handleTranslate = () => {
    const messageArray = message
        .replace(/\s*\/AR\s*$/i, '') // Loại bỏ /AR (hoặc /ar) ở cuối chuỗi cùng khoảng trắng xung quanh
        .replace(/[.]/g, ' ')
        .split(/[-/–]/)                  // Cắt chuỗi thành mảng 

    const translatedMessage = messageArray.map(items => items.trim().split(' ').map(item => mapping[item-1]).join('')).join(' ');
        
    setResult(translatedMessage + '\n' + '=>' + decodeTelex(translatedMessage));
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 transition-all duration-300 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-teal-500 rounded-full shadow-sm"></div>
            <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Dạng Ma Phương
            </header>
            </div>
            
            {/* Nút thông tin hướng dẫn bật/tắt ẩn hiện */}
            <button
            onClick={() => setShowHelp(!showHelp)}
            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                showHelp 
                ? 'bg-teal-50 border-teal-200 text-teal-600' 
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
            {/* Tiêu đề sắc nét */}
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-base tracking-tight">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 font-normal">
                💡
            </div>
            Hướng dẫn & Ví dụ thực tế
            </h4>
            
            {/* Các phân đoạn nội dung chính */}
            <div className="space-y-4">
                
            {/* Phần Khóa (Key) - Cập nhật chính xác theo 1Tm 4, 1 */}
            <div className="flex flex-col gap-1.5">
                <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                    Khóa (Key)
                </span>
                </div>
                <p className="text-slate-700 font-medium italic pl-1 leading-relaxed border-l-2 border-amber-300">
                “Thần khí phán rõ ràng: vào những thời cuối cùng, một số người sẽ bỏ đức tin mà theo những thần khí lừa dối và những giáo huấn của <strong className="text-amber-700 font-black underline">ma</strong> quỷ”. (1Tm 4, 1)
                </p>
            </div>

            {/* Phần Bản tin thô dạng chuỗi tọa độ số */}
            <div className="flex flex-col gap-1.5">
                <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                    Bản tin thô
                </span>
                </div>
                <div className="font-mono text-xs bg-white border border-slate-200 p-2.5 rounded-xl text-indigo-950 overflow-x-auto whitespace-nowrap scrollbar-none tracking-wide">
                1.15.15.1 – 13.19.19.6.2 – 6.5.19.1.8 – 22.22.11.17.9.18 – 7.14.6.19.19. /AR
                </div>
            </div>

            {/* Đường gạch ngăn cách mờ tinh tế */}
            <div className="border-t border-slate-200/60 my-2"></div>

            {/* Phần Đặc điểm / Quy luật Ma Phương */}
            <div className="flex flex-col gap-2">
                <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                        Quy luật nhận dạng (Ma Phương)
                    </span>
                </div>
                <p className="text-slate-600 pl-1 font-medium leading-relaxed">
                    Ma phương là một hình vuông chứa 25 ô nhỏ bên trong (5 x 5), mỗi ô được đánh số từ 1 đến 25 sao cho: <span className="text-indigo-600 font-bold">Tổng các hàng ngang = tổng các hàng dọc = tổng 2 đường chéo = 65</span>. Do đó, dạng này còn gọi là bảng tọa độ 65.
                </p>
                
                {/* Các lưu ý giải mã phẳng tối ưu cho mobile */}
                <div className="space-y-2 mt-1 pl-1">
                    <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                        <span className="text-indigo-500 mt-0.5">✦</span>
                        <span>Từ chữ gợi ý <span className="text-slate-900 font-bold">"ma"</span> trong khóa, người giải mã cần dựng một ma phương 5x5 theoiêu chuẩn (với thứ tự phân bổ số đặc trưng từ 1 đến 25 tạo tổng 65).</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                        <span className="text-indigo-500 mt-0.5">✦</span>
                        <span>Các con số trong bản tin thô chính là số thứ tự nằm trên các ô ma phương. Hãy đối chiếu vị trí số đó tương ứng với bảng chữ cái Alphabet (A=3, B=16, C=9...) để suy ra bạch văn.</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    {Array.from({ length: 5 }, (_, rowIndex) => (
                        <div key={rowIndex} className="flex">
                            {Array.from({ length: 5 }, (_, colIndex) => {
                                // Tính toán mã Code ASCII (a bắt đầu từ 97)
                                const charCode = 97 + (rowIndex * 5 + colIndex);
                                const char = String.fromCharCode(charCode);
                                const index = mapping.indexOf(char.toUpperCase());

                                return (
                                    <div 
                                        key={colIndex} 
                                        className="w-16 h-16 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 bg-white uppercase"
                                    >
                                        {char} <br/> {index+1}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            </div>
        </div>
        )}

        {/* Form nhập liệu */}
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase pl-1">
                Bản tin
            </label>
            <textarea 
                onChange={(e) => setMessage(e.target.value)} 
                value={message} 
                placeholder="Ví dụ:  1.15.15.1–13.19.19.6.2– 6.5.19.1.8 – 22.22.11.17.9.18 – 7.14.6.19.19"
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 min-h-[90px] focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
            />
            </div>

            <div className="flex flex-col gap-1 mt-1 rounded-2xl border border-teal-100 p-3.5" style={{ backgroundColor: 'rgba(20, 184, 166, 0.04)' }}>
            <label className="text-[11px] font-bold text-teal-700 tracking-wider uppercase pl-1">
                Bạch văn
            </label>
            <textarea 
                readOnly 
                value={result} 
                placeholder="Kết quả giải mã sẽ xuất hiện tại đây..."
                className="w-full bg-transparent border-none p-1 text-lg font-bold text-slate-900 uppercase outline-none resize-none min-h-[60px]"
            />
            </div>
        </div>

        {/* Nút bấm tác vụ */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 mt-6">
            <button 
            onClick={handleClear} 
            className="w-full py-3.5 px-6 order-2 sm:order-1 border border-slate-200 rounded-2xl text-sm md:text-base font-bold text-slate-700 bg-white shadow-sm transition-all duration-150 cursor-pointer active:bg-slate-50 active:scale-[0.98]"
            >
            Xóa sạch
            </button>
            <button 
            onClick={handleTranslate} 
            className="w-full py-3.5 px-6 order-1 sm:order-2 rounded-2xl text-sm md:text-base font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg shadow-teal-100 transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
            Giải mã ngay
            </button>  
        </div>
    </div>
  )
}

export default DangMaPhuong