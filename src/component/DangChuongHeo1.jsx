import React, { useState, useEffect } from 'react';
import Toast from './Toast.jsx';

export default function DangChuongHeoChamViTri() {
    const [toast, setToast] = useState({ message: '', type: 'error' });
    const [showHelp, setShowHelp] = useState(false);
    const [message, setMessage] = useState([]); 
    const [result, setResult] = useState("");

    const [currentLines, setCurrentLines] = useState([]); 
    const [currentDotPosition, setCurrentDotPosition] = useState("center"); // "left" | "center" | "right"

    // Logic giải mã: Dựa vào khung ô và vị trí chấm (Trái - Giữa - Phải)
    const decryptCharacter = (char) => {
        if (char.isSpace) return " ";
        const lines = char.lines;
        const pos = char.dotPosition;

        const hasT = lines.includes("top");
        const hasB = lines.includes("bottom");
        const hasL = lines.includes("left");
        const hasR = lines.includes("right");

        // Xác định nhóm 3 chữ cái dựa vào hình dạng ô chuồng
        let group = [];
        if (!hasT && hasB && !hasL && hasR) group = ["A", "B", "C"]; // Góc trên trái ⌟
        if (!hasT && hasB && hasL && hasR)  group = ["D", "E", "F"]; // Ô giữa trên ⎱
        if (!hasT && hasB && hasL && !hasR) group = ["G", "H", "I"]; // Góc trên phải ⌞
        if (hasT && hasB && !hasL && hasR)  group = ["J", "K", "L"]; // Ô giữa trái ⊏
        if (hasT && hasB && hasL && hasR)   group = ["M", "N", "O"]; // Ô trung tâm ⌸
        if (hasT && hasB && hasL && !hasR)  group = ["P", "Q", "R"]; // Ô giữa phải ⊐
        if (hasT && !hasB && !hasL && hasR) group = ["S", "T", "U"]; // Góc dưới trái ⌝
        if (hasT && !hasB && hasL && hasR)  group = ["V", "W", "X"]; // Ô giữa dưới ⎲
        if (hasT && !hasB && hasL && !hasR) group = ["Y", "Z", "*"]; // Góc dưới phải ⌜

        if (group.length === 0) return "?";

        // Lấy chữ cái tương ứng với vị trí chấm
        if (pos === "left")   return group[0];
        if (pos === "center") return group[1];
        if (pos === "right")  return group[2];
        
        return "?";
    };

    // Tự động cập nhật bạch văn khi bản tin thay đổi
    useEffect(() => {
        if (message.length === 0) {
            setResult("");
            return;
        }
        const messageString = message.map(char => decryptCharacter(char)).join("");
        setResult(messageString);
    }, [message]);

    // Hàm vẽ SVG hiển thị vị trí chấm dịch chuyển Trái / Giữa / Phải
    const renderSvgElements = (lines, dotPosition) => {
        const paths = [];
        
        if (lines.includes("top")) paths.push(<path key="top" d="M 5,5 L 35,5" />);
        if (lines.includes("bottom")) paths.push(<path key="bottom" d="M 5,35 L 35,35" />);
        if (lines.includes("left")) paths.push(<path key="left" d="M 5,5 L 5,35" />);
        if (lines.includes("right")) paths.push(<path key="right" d="M 35,5 L 35,35" />);

        // Tính toán tọa độ X của chấm dựa trên vị trí được chọn
        let dotCx = 20; // "center" làm chuẩn ở giữa
        if (dotPosition === "left") dotCx = 12;
        if (dotPosition === "right") dotCx = 28;

        return (
            <>
                <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {paths}
                </g>
                {/* Luôn luôn hiển thị 1 dấu chấm đỏ dịch chuyển vị trí */}
                <circle cx={dotCx} cy="20" r="3" fill="#f43f5e" />
            </>
        );
    };

    const handleDirectionClick = (dir) => {
        if (currentLines.includes(dir)) {
            setCurrentLines(currentLines.filter(line => line !== dir));
        } else {
            setCurrentLines([...currentLines, dir]);
        }
    };

    const handleAddSpace = () => {
        if (currentLines.length === 0) {
            // Khung trống -> Thêm khoảng trắng dấu cách
            setMessage([...message, { isSpace: true, id: Date.now() }]);
            return;
        }

        if (currentLines.length < 2) {
            setToast({ 
                message: "Khung hình chưa đủ nét! Ô chuồng phải chứa ít nhất 2 cạnh.", 
                type: "error" 
            });
            return;
        }

        // Bắt lỗi hai cạnh song song đối diện bất hợp lý
        if (currentLines.length === 2) {
            if ((currentLines.includes("top") && currentLines.includes("bottom")) || 
                (currentLines.includes("left") && currentLines.includes("right"))) {
                setToast({ message: "Chuồng heo không thể chỉ có hai cạnh đối diện song song!", type: "error" });
                return;
            }
        }

        const finishedChar = {
            lines: [...currentLines],
            dotPosition: currentDotPosition,
            isSpace: false,
            id: Date.now()
        };
        setMessage([...message, finishedChar]);
        
        // Reset trạng thái bộ dựng hình (Giữ chấm mặc định ở giữa cho ký tự sau)
        setCurrentLines([]);
        setCurrentDotPosition("center");
    };

    return (
        <div className="flex flex-col gap-4 max-w-xl mx-auto p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-5 bg-indigo-600 rounded-full shadow-sm"></div>
                    <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        Mật Thư Chuồng Heo Số 1
                    </header>
                </div>
                
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                        showHelp 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                    }`}
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
                        {/* ================= PHẦN GỢI Ý ĐIỀU TỐC KHOÁ (OTT) ================= */}
                        <div className="flex flex-col gap-2 bg-amber-50/60 border border-amber-100 rounded-2xl p-4 shadow-2xs relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                            
                            <div className="flex items-center gap-1.5 pl-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-600">
                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                                    Chìa khóa mật thư (OTT)
                                </span>
                            </div>

                            <div className="pl-0.5 text-sm text-slate-700 leading-relaxed font-medium">
                                <blockquote className="border-l-2 border-amber-300 pl-3 italic my-1 bg-white/50 py-2 pr-2 rounded-r-xl">
                                    “Ngài tách biệt chiên với dê, đặt chiên ở bên phải và dê ở bên trái... Còn những người ở giữa sẽ nhận phần phúc lành.”
                                </blockquote>
                                <div className="mt-1.5 text-xs text-amber-700 font-bold flex items-center gap-1 pl-3">
                                    <span>📍 Gợi ý kinh điển:</span>
                                    <span className="bg-amber-100 px-2 py-0.5 rounded-md font-mono text-xs">Vị trí Trái - Giữa - Phải</span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 font-normal">
                                    * Gợi ý giải: Khi bản tin chỉ có một hệ khung chuồng vuông nhưng chứa các dấu chấm nằm dịch chuyển ở các vị trí khác nhau (<span className="font-bold text-slate-600">Trái, Giữa, Phải</span>), ta áp dụng chia cụm 3 chữ cái vào lưới 9 ô.
                                </p>
                            </div>
                        </div>
                        
                        {/* Hướng dẫn tạo ô */}
                        <div className="flex flex-col gap-2">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                                    Cách tạo ô
                                </span>
                            </div>
                            <div className="space-y-1.5 pl-1 text-slate-600 font-medium leading-relaxed">
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">✦</span>
                                    <span><strong>Khung Chuồng vuông:</strong> Chọn các cạnh viền tương ứng để xác định tọa độ của ô trong ma trận 9 ô vuông.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">✦</span>
                                    <span><strong>Vị trí chấm đỏ:</strong> Chọn vị trí dịch chuyển của dấu chấm (<span className="text-rose-500 font-bold">Trái / Giữa / Phải</span>) để chọn chính xác ký tự thứ 1, 2 hay 3 trong ô đó.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">✦</span>
                                    <span>Bấm <strong className="text-indigo-600">Xác nhận ô chữ</strong> để nạp ký tự vào bản tin dịch bạch văn.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Đường gạch ngăn mờ */}
                    <div className="border-t border-slate-200/60 my-3"></div>

                    {/* ================= PHẦN BẢNG TRA CỨU CHUỒNG HEO LƯỚI THẲNG 3x3 ================= */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                                    Sơ đồ Chuồng Heo
                                </span>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-2xl p-6 shadow-inner">
                                {/* Lưới 3x3 chuẩn hóa: Dùng white-space-nowrap để chống sập dòng và border-slate-300 tinh tế */}
                                <div className="grid grid-cols-3 w-full max-w-[220px] aspect-square text-center text-xs md:text-sm font-black tracking-widest text-slate-800 select-none">
                                    {/* Hàng 1 */}
                                    <div className="border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>A B C</span>
                                    </div>
                                    <div className="border-b-2 border-l-2 border-r-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>D E F</span>
                                    </div>
                                    <div className="border-b-2 border-l-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>G H I</span>
                                    </div>
                                    
                                    {/* Hàng 2 */}
                                    <div className="border-t-2 border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>J K L</span>
                                    </div>
                                    <div className="border-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap bg-slate-50/40">
                                        <span>M N O</span>
                                    </div>
                                    <div className="border-t-2 border-b-2 border-l-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>P Q R</span>
                                    </div>
                                    
                                    {/* Hàng 3 */}
                                    <div className="border-t-2 border-r-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>S T U</span>
                                    </div>
                                    <div className="border-t-2 border-l-2 border-r-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>V W X</span>
                                    </div>
                                    <div className="border-t-2 border-l-2 border-slate-300 flex items-center justify-center p-2 whitespace-nowrap">
                                        <span>Y Z *</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================= PHẦN VÍ DỤ MINH HỌA TRỰC QUAN CHẤM DỊCH CHUYỂN ================= */}
                        <div className="flex flex-col gap-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide pl-0.5">
                                Ví dụ minh họa vị trí dấu chấm:
                            </div>
                            
                            <div className="flex flex-wrap gap-5 items-center text-sm font-medium text-slate-600">
                                {/* Ví dụ chữ A - Ô góc trên trái, chấm bên trái */}
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40" class="text-indigo-600"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="12" cy="20" r="3" fill="#f43f5e"></circle></svg>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">=</span>
                                    <span className="font-black text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded-lg shadow-2xs">A</span>
                                </div>

                                {/* Ví dụ chữ O - Ô góc trên trái, chấm ở giữa */}
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40" className="text-indigo-600"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="28" cy="20" r="3" fill="#f43f5e"></circle></svg>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">=</span>
                                    <span className="font-black text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded-lg shadow-2xs">O</span>
                                </div>

                                {/* Ví dụ chữ V - Ô góc trên trái, chấm bên phải */}
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40" className="text-indigo-600"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="12" cy="20" r="3" fill="#f43f5e"></circle></svg>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">=</span>
                                    <span className="font-black text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded-lg shadow-2xs">V</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
            {/* 1. HIỂN THỊ BẢN TIN KÝ TỰ SVG */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center pl-1">
                    <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">Bản Tin</label>
                    {message.length > 0 && (
                        <button 
                            onClick={() => { setMessage([]); setCurrentLines([]); setCurrentDotPosition("center"); }}
                            className="text-[11px] font-bold text-red-500 uppercase hover:text-red-700 transition-colors cursor-pointer"
                        >
                            Xóa sạch
                        </button>
                    )}
                </div>

                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 min-h-[76px] flex items-center justify-between shadow-inner">
                    <div className="flex flex-wrap gap-2.5 items-center text-indigo-600">
                        {message.length > 0 || currentLines.length > 0 ? (
                            <>
                                {message.map((char) => (
                                    char.isSpace ? (
                                        <span key={char.id} className="text-xl font-black text-slate-300 px-1">/</span>
                                    ) : (
                                        <div key={char.id} className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                            <svg width="100%" height="100%" viewBox="0 0 40 40">
                                                {renderSvgElements(char.lines, char.dotPosition)}
                                            </svg>
                                        </div>
                                    )
                                ))}

                                {currentLines.length > 0 && (
                                    <div className="w-9 h-9 flex items-center justify-center border-2 border-dashed border-indigo-400 bg-indigo-50/50 rounded-xl p-1 animate-pulse">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40">
                                            {renderSvgElements(currentLines, currentDotPosition)}
                                        </svg>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div class="flex flex-wrap gap-2.5 items-center text-indigo-600">
                                <span className="text-slate-400 text-sm pl-1 font-medium">Ví dụ: </span>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="12" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="12" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="28" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="28" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 35,5 L 35,35"></path></g><circle cx="12" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <span class="text-xl font-black text-slate-300 px-1">/</span>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="12" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 35,5 L 35,35"></path></g><circle cx="28" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                                <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path></g><circle cx="28" cy="20" r="3" fill="#f43f5e"></circle></svg></div>
                            </div>
                        )}
                    </div>
                    
                    {/* Nút Backspace */}
                    {(message.length > 0 || currentLines.length > 0) && (
                        <button 
                            onClick={() => {
                                if (currentLines.length > 0) {
                                    setCurrentLines(currentLines.slice(0, -1));
                                } else {
                                    setMessage(message.slice(0, -1));
                                }
                            }}
                            className="ml-2 p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 shadow-sm transition-all flex-shrink-0 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* 2. BỘ ĐIỀU KHIỂN DỰNG HÌNH */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                <div className="md:col-span-2 flex flex-col gap-4">
                    
                    {/* Bấm chọn cạnh */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Bấm chọn các cạnh viền ô chuồng</span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {[
                                { val: "top", label: "Nét Trên ‾" },
                                { val: "bottom", label: "Nét Dưới _" },
                                { val: "left", label: "Nét Trái |" },
                                { val: "right", label: "Nét Phải |" }
                            ].map((item) => (
                                <button
                                    key={item.val}
                                    type="button"
                                    onClick={() => handleDirectionClick(item.val)}
                                    className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${currentLines.includes(item.val) ? "bg-slate-800 border-slate-800 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                                >
                                    {item.label} {currentLines.includes(item.val) && "✓"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bộ chọn Vị trí Chấm di động (Trái - Giữa - Phải) */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Vị trí dấu chấm trong ô</span>
                        <div className="grid grid-cols-3 gap-1.5">
                            {[
                                { value: "left", label: "Bên Trái" },
                                { value: "center", label: "Ở Giữa" },
                                { value: "right", label: "Bên Phải" }
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setCurrentDotPosition(item.value)}
                                    className={`py-2 px-1 text-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${currentDotPosition === item.value ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Khung Preview ô ký tự và nút Lưu */}
                <div className="flex flex-col items-center justify-between border border-dashed border-slate-200 bg-white rounded-2xl p-3">
                    <div className="text-center w-full">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Ký tự đang vẽ</span>
                        <div className="w-20 h-20 mx-auto border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner text-slate-800">
                            <svg width="56" height="56" viewBox="0 0 40 40">
                                {renderSvgElements(currentLines, currentDotPosition)}
                            </svg>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddSpace}
                        className="w-full mt-3 bg-indigo-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all hover:bg-indigo-700 active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                    >
                        <span className="tracking-wider text-sm font-black">
                            {currentLines.length === 0 ? "Thêm dấu cách [Space]" : "Xác nhận ô chữ"}
                        </span>
                    </button>
                </div>
            </div>

            {/* ================= BẠCH VĂN (KẾT QUẢ GIẢI MÃ CHÍNH XÁC) ================= */}
            <div className="flex flex-col gap-1.5 mt-2 rounded-2xl border border-indigo-100 p-4 bg-indigo-50/30 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />

                <div className="flex justify-between items-center pl-1">
                    <label className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase">Bạch văn (Kết quả)</label>
                    {result && (
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(result)}
                            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                        >
                            Sao chép
                        </button>
                    )}
                </div>

                <div className="w-full min-h-[56px] p-1 text-xl font-black tracking-wide text-slate-900 uppercase break-words select-all">
                    {result ? (
                        <span className="font-mono bg-white border border-slate-100 rounded-xl px-2 py-1 shadow-2xs">{result}</span>
                    ) : (
                        <span className="text-slate-400 font-medium normal-case italic text-sm">Bạch văn dịch ra sẽ xuất hiện ở đây...</span>
                    )}
                </div>
            </div>
            
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: '', type: 'error' })} 
                duration={3000} 
            />
        </div>
    );
}