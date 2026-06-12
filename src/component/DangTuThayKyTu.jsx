import {useState} from 'react'
import decodeTelex from '../library/decodeTelex.js'

function DangTuThayKyTu() {
    const [showHelp, setShowHelp] = useState(false);
    const [key, setKey] = useState('');
    const [message, setMessage] = useState('');
    const [result, setResult] = useState('');
    const map = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I',
        9: 'J',
        10: 'K',
        11: 'L',
        12: 'M',
        13: 'N',
        14: 'O',
        15: 'P',
        16: 'Q',
        17: 'R',
        18: 'S',
        19: 'T',
        20: 'U',
        21: 'V',
        22: 'W',
        23: 'X',
        24: 'Y',
        25: 'Z',
    }

    const handleClear = () => {
        // Clear logic here
        setKey('');
        setMessage('');
        setResult('');
    }

    const handleTranslate = () => {
        // 1. Cắt bỏ phần nguồn trong ngoặc đơn "(Mt 7, 3)"
        const mainKey = key.split("(")[0];

        // 2. Dùng Regex để tìm tất cả các từ thuần túy (chữ cái)
        // \p{L} khớp với bất kỳ chữ cái nào trong bất kỳ ngôn ngữ nào (hỗ trợ tốt tiếng Việt)
        const keyArray = mainKey.match(/\p{L}+/gu);

        //3. Tạo Object ánh xạ giữa các ký tự trong key và bảng chữ cái tiếng Anh dựa trên vị trí của chúng (Ví dụ: R <-> A, X <-> B, ...)
        const mapping = {};
        for (let i = 0; i < keyArray.length; i++) {
            mapping[map[i]] = keyArray[i].toLowerCase();
        }

        //4. Dựa vào Object ánh xạ vừa tạo, tiến hành dịch ngược từng ký tự trong message về dạng chữ thường, sau đó ghép lại thành chuỗi hoàn chỉnh
        const mesArray = message
            .replace(/\s*\/AR\s*$/i, '') // Loại bỏ /AR (hoặc /ar) ở cuối chuỗi cùng khoảng trắng xung quanh
            .replace(/\./g, '')          // Xóa dấu chấm thừa (nếu có)
            .split(',')                  // Cắt chuỗi thành mảng theo dấu phẩy
            .map(item => item.trim().toUpperCase());
            
        const translatedMessage = mesArray.map(chars =>
            chars.split('').map(char => {
                const foundChar = mapping[char];
                if (!foundChar) {
                    console.log('Không tìm thấy ký tự trong key: ', char);
                    return char; // Nếu không tìm thấy ký tự trong key, giữ nguyên ký tự đó
                }
                return foundChar;
            }).join(' ')
        ).join(' ');
        setResult(translatedMessage);
    }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-5 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 transition-all duration-300 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-indigo-600 rounded-full shadow-sm"></div>
            <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Mật Thư Từ Thay Ký Tự
            </header>
            </div>
            
            {/* Nút thông tin hướng dẫn tối ưu cho Mobile */}
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
            {/* Tiêu đề sắc nét */}
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-base tracking-tight">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 font-normal">
                💡
            </div>
            Hướng dẫn & Ví dụ thực tế
            </h4>
            
            {/* Các phân đoạn nội dung chính */}
            <div className="space-y-4">
                
            {/* Phần Khóa (Key) - Cập nhật theo Mt 7, 3 */}
            <div className="flex flex-col gap-1.5">
                <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                    Khóa (Key)
                </span>
                </div>
                <p className="text-slate-700 font-medium italic pl-1 leading-relaxed border-l-2 border-amber-300">
                “Sao anh thấy cái rác trong con mắt của người anh em, mà cái xà trong con mắt của mình thì lại không để ý tới?” (Mt 7, 3)
                </p>
            </div>

            {/* Phần Bản tin thô mới */}
            <div className="flex flex-col gap-1.5">
                <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                    Bản tin thô
                </span>
                </div>
                <div className="font-mono text-xs bg-white border border-slate-200 p-2.5 rounded-xl text-indigo-950 overflow-x-auto whitespace-nowrap scrollbar-none tracking-wide">
                NOFHTUWC, AVXYNEPRIBLT. /AR
                </div>
            </div>

            {/* Đường gạch ngăn cách mờ tinh tế */}
            <div className="border-t border-slate-200/60 my-2"></div>

            {/* Phần Đặc điểm / Quy luật */}
            <div className="flex flex-col gap-2">
                <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                    Quy luật nhận dạng
                </span>
                </div>
                <p className="text-slate-600 pl-1 font-medium leading-relaxed">
                Đây là dạng mật thư mà những ký tự ở bản tin sẽ được thay thế với một từ tương ứng.
                </p>
                
                {/* Các lưu ý phẳng tối ưu cho mobile */}
                <div className="space-y-2 mt-1 pl-1">
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                    <span className="text-indigo-500 mt-0.5">✦</span>
                    <span>Dựa vào mối tương quan logic hoặc từ đối lập xuất hiện trong Khóa (Ví dụ: Rác <span className="text-slate-900 font-bold">↔</span> Xà, Anh em <span className="text-slate-900 font-bold">↔</span> Mình) để xác định các chữ cái đại diện bị hoán đổi.</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                    <span className="text-indigo-500 mt-0.5">✦</span>
                    <span>Tiến hành đối chiếu từng chữ cái trong bản tin mật mã dựa theo hệ thống bảng mã thay thế vừa trích xuất từ văn cảnh để tìm ra kết quả dịch chuẩn.</span>
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
                Khoá
            </label>
            <textarea 
                onChange={(e) => setKey(e.target.value)} 
                value={key} 
                placeholder="Nhập khoá giải mã..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 min-h-[90px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
            </div>

            <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase pl-1">
                Bản tin
            </label>
            <textarea 
                onChange={(e) => setMessage(e.target.value)} 
                value={message} 
                placeholder="Nhập bản tin thô cần lọc chữ ẩn..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-base font-semibold text-slate-800 shadow-sm outline-none transition-all duration-300 min-h-[90px] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
            </div>

            <div className="flex flex-col gap-1 mt-1 rounded-2xl border border-indigo-100 p-3.5" style={{ backgroundColor: 'rgba(79, 70, 229, 0.04)' }}>
            <label className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase pl-1">
                Bạch văn (Kết quả tìm được)
            </label>
            <textarea 
                readOnly 
                value={result} 
                placeholder="Các chữ ẩn giấu sau khi giải mã sẽ hiện ở đây..."
                className="w-full bg-transparent border-none p-1 text-lg font-bold text-slate-900 uppercase outline-none resize-none min-h-[60px]"
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

export default DangTuThayKyTu