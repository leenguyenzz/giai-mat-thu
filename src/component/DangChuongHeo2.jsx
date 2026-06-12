import React, { useState, useEffect } from 'react';
import Toast from './Toast.jsx';

// -------------------------------------------------------------------------
// HÀM HELPER & BẢNG MA TRẬN PHỤC VỤ GIẢI MÃ CHUỒNG HEO 2
// -------------------------------------------------------------------------

// Hàm chuẩn hóa các nét vẽ thành một chuỗi key duy nhất (ví dụ: "bottom,left,right")
const getLinesKey = (lines) => {
    return [...lines].sort().join(",");
};

// Định nghĩa cấu trúc ma trận 9 ô thẳng (A - I) dựa theo các cạnh border
const STRAIGHT_MATRIX = {
    [getLinesKey(["bottom", "right"])]: "A",           // Ô góc trên trái
    [getLinesKey(["bottom", "left", "right"])]: "B",    // Ô trên giữa
    [getLinesKey(["bottom", "left"])]: "C",            // Ô góc trên phải
    [getLinesKey(["top", "bottom", "right"])]: "D",     // Ô giữa trái
    [getLinesKey(["top", "bottom", "left", "right"])]: "E", // Ô trung tâm
    [getLinesKey(["top", "bottom", "left"])]: "F",      // Ô giữa phải
    [getLinesKey(["top", "right"])]: "G",              // Ô góc dưới trái
    [getLinesKey(["top", "left", "right"])]: "H",       // Ô dưới giữa
    [getLinesKey(["top", "left"])]: "I"                // Ô góc dưới phải
};

// Định nghĩa cấu trúc chuồng chéo dựa theo hướng nét vẽ (Trên - Dưới - Trái - Phải)
const DIAGONAL_MATRIX = {
    [getLinesKey(["top-left", "top-right"])]: "S",       // Góc nhọn hướng lên (Trên)
    [getLinesKey(["bottom-left", "bottom-right"])]: "V", // Góc nhọn hướng xuống (Dưới)
    [getLinesKey(["top-left", "bottom-left"])]: "T",     // Góc nhọn hướng sang trái (Trái)
    [getLinesKey(["top-right", "bottom-right"])]: "U"    // Góc nhọn hướng sang phải (Phải)
};

// Bảng dịch chuyển ký tự (Tịnh tiến) khi chuồng có 1 dấu chấm ở giữa (center)
const DOT_SHIFT = {
    // Chuồng thẳng: A->J, B->K, C->L, D->M, E->N, F->O, G->P, H->Q, I->R
    A: "J", B: "K", C: "L", D: "M", E: "N", F: "O", G: "P", H: "Q", I: "R",
    // Chuồng chéo: S->W, V->Z, T->X, U->Y
    S: "W", V: "Z", T: "X", U: "Y"
};

/**
 * Hàm giải mã chính cho Chuồng Heo 2
 */
const decodePigpen2 = (type, lines, dot) => {
    if (!lines || lines.length === 0) return "";

    const key = getLinesKey(lines);
    let character = "?";

    // 1. Tìm ký tự gốc ở tầng không chấm
    if (type === "straight") {
        character = STRAIGHT_MATRIX[key] || "?";
    } else if (type === "diagonal") {
        character = DIAGONAL_MATRIX[key] || "?";
    }

    // 2. Nếu tìm thấy ký tự gốc và có chấm, tiến hành đổi tầng chữ cái
    if (character !== "?" && dot === "center") {
        character = DOT_SHIFT[character] || "?";
    }

    return character;
};

// -------------------------------------------------------------------------
// COMPONENT CHÍNH
// -------------------------------------------------------------------------
export default function DangChuongHeo2() {
    const [toast, setToast] = useState({ message: '', type: 'error' });
    const [showHelp, setShowHelp] = useState(false);
    const [message, setMessage] = useState([]); 
    const [result, setResult] = useState("");

    const [currentType, setCurrentType] = useState("straight"); 
    const [currentLines, setCurrentLines] = useState([]); 
    const [currentDot, setCurrentDot] = useState("none"); // "none" hoặc "center"

    // Tự động dịch nghĩa toàn bộ Bản tin theo quy luật Chuồng Heo 2
    useEffect(() => {
        if (message.length === 0) {
            setResult("");
            return;
        }
        const messageString = message.map(char => {
            if (char.isSpace) return " ";
            return decodePigpen2(char.type, char.lines, char.dot);
        }).join("");
        
        setResult(messageString);
    }, [message]);

    // Hàm vẽ SVG đồng nhất cho cả xem trước và các phần tử trong danh sách bản tin
    const renderSvgElements = (type, lines, dot) => {
        const paths = [];
        let dotCx = 20; 
        let dotCy = 20; 

        if (type === "straight") {
            // 1. CHUỒNG VUÔNG
            if (lines.includes("top"))    paths.push(<path key="top" d="M 5,5 L 35,5" />);
            if (lines.includes("bottom")) paths.push(<path key="bottom" d="M 5,35 L 35,35" />);
            if (lines.includes("left"))   paths.push(<path key="left" d="M 5,5 L 5,35" />);
            if (lines.includes("right"))  paths.push(<path key="right" d="M 35,5 L 35,35" />);
            
            // Chuồng thẳng thì dấu chấm luôn ở tâm hình vuông
            dotCx = 20;
            dotCy = 20;
        } else {
            // 2. CHUỒNG CHÉO: TẠO ĐỈNH NHỌN GIAO NHAU Ở CẠNH ĐỐI DIỆN
            const topLeft = "5,5";
            const topRight = "35,5";
            const bottomLeft = "5,35";
            const bottomRight = "35,35";

            const hasTL = lines.includes("top-left");
            const hasTR = lines.includes("top-right");
            const hasBL = lines.includes("bottom-left");
            const hasBR = lines.includes("bottom-right");

            // Hình `<` (Ký tự T - Góc nhọn hướng sang trái, đỉnh chạm biên phải 35,20)
            if (hasTL && hasBL && lines.length === 2) {
                paths.push(<path key="v-left" d={`M ${topLeft} L 35,20 L ${bottomLeft}`} />);
                dotCx = 18; // Dấu chấm thụt về bên trái lòng chữ <
                dotCy = 20;
            } 
            // Hình `>` (Ký tự U - Góc nhọn hướng sang phải, đỉnh chạm biên trái 5,20)
            else if (hasTR && hasBR && lines.length === 2) {
                paths.push(<path key="v-right" d={`M ${topRight} L 5,20 L ${bottomRight}`} />);
                dotCx = 22; // Dấu chấm thụt về bên phải lòng chữ >
                dotCy = 20;
            } 
            // Hình `V` xuôi (Ký tự S - Góc nhọn hướng lên trên, đỉnh chạm biên dưới 20,35)
            else if (hasTL && hasTR && lines.length === 2) {
                paths.push(<path key="v-top" d={`M ${topLeft} L 20,35 L ${topRight}`} />);
                dotCx = 20;
                dotCy = 18; // Dấu chấm nhích lên trên lòng chữ V
            } 
            // Hình `^` ngược (Ký tự V - Góc nhọn hướng xuống dưới, đỉnh chạm biên trên 20,5)
            else if (hasBL && hasBR && lines.length === 2) {
                paths.push(<path key="v-bottom" d={`M ${bottomLeft} L 20,5 L ${bottomRight}`} />);
                dotCx = 20;
                dotCy = 22; // Dấu chấm dịch xuống dưới lòng chữ ^
            } 
            else {
                // Trường hợp người dùng mới bấm 1 nét dở dang: Vẽ nét đứt hướng tâm để gợi ý
                if (hasTL) paths.push(<path key="tl" d="M 5,5 L 20,20" strokeDasharray="2,2" />);
                if (hasTR) paths.push(<path key="tr" d="M 35,5 L 20,20" strokeDasharray="2,2" />);
                if (hasBL) paths.push(<path key="bl" d="M 5,35 L 20,20" strokeDasharray="2,2" />);
                if (hasBR) paths.push(<path key="br" d="M 35,35 L 20,20" strokeDasharray="2,2" />);
                
                dotCx = 20;
                dotCy = 20;
            }
        }

        // Chỉ render dấu chấm khi trạng thái là "center" (Chuồng Heo 2)
        const dotElement = dot === "center" ? <circle cx={dotCx} cy={dotCy} r="3" fill="#f43f5e" /> : null;

        return (
            <>
                <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {paths}
                </g>
                {dotElement}
            </>
        );
    };

    const handleTypeChange = (type) => {
        setCurrentType(type);
        setCurrentLines([]); // Clear nét khi đổi cấu trúc chuồng nhằm tránh lỗi logic chéo/thẳng
    };

    const handleDirectionClick = (dir) => {
        if (currentLines.includes(dir)) {
            setCurrentLines(currentLines.filter(line => line !== dir));
        } else {
            setCurrentLines([...currentLines, dir]);
        }
    };

    const handleAddSpace = () => {
        if (currentLines.length === 0 && currentDot === "none") {
            // Khung trống hoàn toàn -> Thêm dấu cách cách từ
            setMessage([...message, { isSpace: true, id: Date.now() }]);
            return;
        }

        // Kiểm tra xem nét vẽ hiện tại có tạo thành ký tự hợp lệ nào trong Chuồng Heo 2 không
        const checkChar = decodePigpen2(currentType, currentLines, currentDot);
        if (checkChar === "?") {
            setToast({ 
                message: "Tổ hợp nét vẽ hiện tại không tương ứng với ô ký tự hợp lệ nào trong Chuồng Heo 2!", 
                type: "error" 
            });
            return;
        }

        // Lưu ký tự hợp lệ vào mảng tin
        const finishedChar = {
            type: currentType,
            lines: [...currentLines],
            dot: currentDot,
            isSpace: false,
            id: Date.now()
        };
        setMessage([...message, finishedChar]);
        
        // Trả các biến trạng thái về giá trị ban đầu để chuẩn bị dựng từ tiếp theo
        setCurrentLines([]);
        setCurrentDot("none");
    };

    return (
        <div className="flex flex-col gap-4 max-w-xl mx-auto p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-5 bg-indigo-600 rounded-full shadow-sm"></div>
                    <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        Mật Thư Chuồng Heo 2
                    </header>
                </div>
                
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

            {/* Khung nội dung hướng dẫn thả xuống */}
            {showHelp && (
                <div className="mb-6 p-5 bg-slate-50/80 border border-slate-200/60 rounded-3xl text-slate-800 text-sm animate-fadeIn shadow-inner">
                    <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-base tracking-tight">
                        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 font-normal">
                            💡
                        </div>
                        Hướng dẫn & Quy luật nhận dạng
                    </h4>
                    
                    <div className="space-y-4">
                        {/* PHẦN GỢI Ý ĐIỀU TỐC KHOÁ (OTT) */}
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
                                    “Bầy heo ấy đang ăn ở trên núi. Các quỷ nài xin Người cho phép nhập vào bầy heo kia, và Người cho phép.”
                                </blockquote>
                                <div className="mt-1.5 text-xs text-amber-700 font-bold flex items-center gap-1 pl-3">
                                    <span>📍 Trích dẫn Kinh Thánh:</span>
                                    <span className="bg-amber-100 px-2 py-0.5 rounded-md font-mono text-xs">Tin Mừng Luca (Lc 8, 32)</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Hướng dẫn tạo ô */}
                        <div className="flex flex-col gap-2">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                                    Quy tắc nhận dạng ký tự
                                </span>
                            </div>
                            <div className="space-y-1.5 pl-1 text-slate-600 font-medium leading-relaxed">
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">✦</span>
                                    <span><strong>Chuồng thẳng không chấm (A - I):</strong> Lấy ký tự ở hệ lưới 9 ô vuông đầu tiên.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">✦</span>
                                    <span><strong>Chuồng thẳng có chấm (J - R):</strong> Lấy ký tự ở hệ lưới 9 ô vuông thứ hai khi có chấm đỏ ở giữa ô.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-500 mt-0.5">✦</span>
                                    <span><strong>Chuồng chéo (S - Z):</strong> Xác định góc nhọn theo hướng Trên - Dưới - Trái - Phải. Hệ không chấm gồm <code className="font-mono bg-slate-200 px-1 rounded">S,V,T,U</code> và hệ có chấm gồm <code className="font-mono bg-slate-200 px-1 rounded">W,Z,X,Y</code>.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200/60 my-4"></div>

                    {/* SƠ ĐỒ TRA CỨU CHUỒNG HEO 2 */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                                Sơ đồ Chuồng Heo
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-slate-100 rounded-2xl p-5 shadow-inner">
                            {/* 1. LƯỚI THẲNG 1: KHÔNG CHẤM (A - I) */}
                            <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Hệ 9 ô trơn (A - I)</span>
                                <div className="grid grid-cols-3 w-full max-w-[140px] aspect-square text-center text-sm font-black text-slate-800 select-none">
                                    <div className="border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2">A</div>
                                    <div className="border-b-2 border-l-2 border-r-2 border-slate-300 flex items-center justify-center p-2">B</div>
                                    <div className="border-b-2 border-l-2 border-slate-300 flex items-center justify-center p-2">C</div>
                                    <div className="border-t-2 border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2">D</div>
                                    <div className="border-2 border-slate-300 flex items-center justify-center p-2 bg-slate-50/40">E</div>
                                    <div className="border-t-2 border-b-2 border-l-2 border-slate-300 flex items-center justify-center p-2">F</div>
                                    <div className="border-t-2 border-r-2 border-slate-300 flex items-center justify-center p-2">G</div>
                                    <div className="border-t-2 border-l-2 border-r-2 border-slate-300 flex items-center justify-center p-2">H</div>
                                    <div className="border-t-2 border-l-2 border-slate-300 flex items-center justify-center p-2">I</div>
                                </div>
                            </div>

                            {/* 2. LƯỚI THẲNG 2: CÓ CHẤM (J - R) */}
                            <div className="flex flex-col items-center justify-center border-b sm:border-b-0 lg:border-r border-slate-100 pb-4 sm:pb-0 lg:pr-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Hệ 9 ô có chấm (J - R)</span>
                                <div className="grid grid-cols-3 w-full max-w-[140px] aspect-square text-center text-sm font-black text-slate-800 select-none">
                                    <div className="border-b-2 border-r-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>J</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-b-2 border-l-2 border-r-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>K</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-b-2 border-l-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>L</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-t-2 border-b-2 border-r-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>M</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-2 border-slate-300 flex flex-col items-center justify-center p-1 bg-slate-50/40"><span>N</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-t-2 border-b-2 border-l-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>O</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-t-2 border-r-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>P</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-t-2 border-l-2 border-r-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>Q</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                    <div className="border-t-2 border-l-2 border-slate-300 flex flex-col items-center justify-center p-1"><span>R</span><span className="text-xs text-rose-500 -mt-1">•</span></div>
                                </div>
                            </div>

                            {/* 3. CHUỒNG CHÉO 1: KHÔNG CHẤM (S - V - T - U) */}
                            <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Chéo trơn (S - V - T - U)</span>
                                <div className="relative w-full max-w-[140px] aspect-square flex items-center justify-center select-none">
                                    <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <line x1="2" y1="2" x2="98" y2="98" />
                                        <line x1="98" y1="2" x2="2" y2="98" />
                                    </svg>
                                    <div className="absolute top-1.5 text-sm font-black text-slate-800">S</div>
                                    <div className="absolute bottom-1.5 text-sm font-black text-slate-800">V</div>
                                    <div className="absolute left-2 text-sm font-black text-slate-800">T</div>
                                    <div className="absolute right-2 text-sm font-black text-slate-800">U</div>
                                </div>
                            </div>

                            {/* 4. CHUỒNG CHÉO 2: CÓ CHẤM (W - Z - X - Y) */}
                            <div className="flex flex-col items-center justify-center pt-2 sm:pt-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Chéo có chấm (W - Z - X - Y)</span>
                                <div className="relative w-full max-w-[140px] aspect-square flex items-center justify-center select-none">
                                    <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <line x1="2" y1="2" x2="98" y2="98" />
                                        <line x1="98" y1="2" x2="2" y2="98" />
                                    </svg>
                                    <div className="absolute top-1 flex flex-col items-center text-sm font-black text-slate-800"><span>W</span><span className="text-xs text-rose-500 -mt-2.5">•</span></div>
                                    <div className="absolute bottom-1 flex flex-col items-center text-sm font-black text-slate-800"><span className="text-xs text-rose-500 -mb-2">•</span><span>Z</span></div>
                                    <div className="absolute left-2 flex items-center gap-0.5 text-sm font-black text-slate-800"><span className="text-xs text-rose-500">•</span><span>X</span></div>
                                    <div className="absolute right-2 flex items-center gap-0.5 text-sm font-black text-slate-800"><span>Y</span><span className="text-xs text-rose-500">•</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
            {/* 1. KHU VỰC HIỂN THỊ BẢN TIN KÝ TỰ SVG */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center pl-1">
                    <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">Bản Tin</label>
                    {message.length > 0 && (
                        <button 
                            onClick={() => { setMessage([]); setCurrentLines([]); setCurrentDot("none"); }}
                            className="text-[11px] font-bold text-red-500 uppercase hover:text-red-700 transition-colors cursor-pointer"
                        >
                            Xóa sạch
                        </button>
                    )}
                </div>

                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 min-h-[76px] flex items-center justify-between shadow-inner">
                    <div className="flex flex-wrap gap-2.5 items-center text-indigo-600">
                        {message.length > 0 || currentLines.length > 0 || currentDot !== "none" ? (
                            <>
                                {message.map((char) => (
                                    char.isSpace ? (
                                        <span key={char.id} className="text-xl font-black text-slate-300 px-1">/</span>
                                    ) : (
                                        <div key={char.id} className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                            <svg width="100%" height="100%" viewBox="0 0 40 40">
                                                {renderSvgElements(char.type, char.lines, char.dot)}
                                            </svg>
                                        </div>
                                    )
                                ))}

                                {(currentLines.length > 0 || currentDot !== "none") && (
                                    <div className="w-9 h-9 flex items-center justify-center border-2 border-dashed border-indigo-400 bg-indigo-50/50 rounded-xl p-1 animate-pulse">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40">
                                            {renderSvgElements(currentType, currentLines, currentDot)}
                                        </svg>
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-slate-400 text-sm pl-1 font-medium">Bấm các nét bên dưới để bắt đầu dựng mật thư...</span>
                        )}
                    </div>
                    
                    {/* Nút Backspace */}
                    {(message.length > 0 || currentLines.length > 0 || currentDot !== "none") && (
                        <button 
                            onClick={() => {
                                if (currentLines.length > 0 || currentDot !== "none") {
                                    if (currentLines.length > 0) {
                                        setCurrentLines(currentLines.slice(0, -1));
                                    } else {
                                        setCurrentDot("none");
                                    }
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

            {/* 2. BẢNG TRÌNH ĐIỀU KHIỂN NÉT VẼ ĐỘNG */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                <div className="md:col-span-2 flex flex-col gap-3">
                    {/* Chọn loại chuồng */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleTypeChange("straight")}
                            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${currentType === "straight" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                        >
                            Chuồng thẳng (— |)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange("diagonal")}
                            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${currentType === "diagonal" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                        >
                            Chuồng chéo (/ \)
                        </button>
                    </div>

                    {/* Chọn tổ hợp các nét */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Thêm nét vào ô hiện tại</span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {currentType === "straight" ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    {[
                                        { val: "top-left", label: "Chéo Trên Trái ↖", opposite: "bottom-right" },
                                        { val: "top-right", label: "Chéo Trên Phải ↗", opposite: "bottom-left" },
                                        { val: "bottom-left", label: "Chéo Dưới Trái ↙", opposite: "top-right" },
                                        { val: "bottom-right", label: "Chéo Dưới Phải ↘", opposite: "top-left" }
                                    ].map((item) => {
                                        const isOppositeSelected = currentLines.includes(item.opposite);
                                        const isSelected = currentLines.includes(item.val);

                                        return (
                                            <button
                                                key={item.val}
                                                type="button"
                                                disabled={isOppositeSelected}
                                                onClick={() => handleDirectionClick(item.val)}
                                                className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer 
                                                    ${isSelected 
                                                        ? "bg-slate-800 border-slate-800 text-white shadow-sm" 
                                                        : isOppositeSelected
                                                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {item.label} {currentLines.includes(item.val) && "✓"}
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Chọn tầng chữ cái */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chọn dấu chấm</span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {[
                                { value: "none", label: "Không chấm" },
                                { value: "center", label: "Chấm giữa" }
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setCurrentDot(item.value)}
                                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${currentDot === item.value ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                                Aminated>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Khung Xem Trước & Nút Xác nhận */}
                <div className="flex flex-col items-center justify-between border border-dashed border-slate-200 bg-white rounded-2xl p-3">
                    <div className="text-center w-full">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Ký tự đang dựng</span>
                        <div className="w-20 h-20 mx-auto border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner text-slate-800">
                            <svg width="56" height="56" viewBox="0 0 40 40">
                                {renderSvgElements(currentType, currentLines, currentDot)}
                            </svg>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddSpace}
                        className="w-full mt-3 bg-indigo-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all hover:bg-indigo-700 active:scale-95 flex flex-col items-center justify-center cursor-pointer"
                    >
                        <span className="tracking-wider text-sm font-black">
                            {currentLines.length === 0 ? "Thêm dấu cách [Space]" : "Xác nhận ô / Chuyển chữ"}
                        </span>
                    </button>
                </div>
            </div>

            {/* ================= KHU VỰC BẠCH VĂN (KẾT QUẢ GIẢI MÃ) ================= */}
            <div className="flex flex-col gap-1.5 mt-2 rounded-2xl border border-indigo-100 p-4 bg-indigo-50/30 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />

                <div className="flex justify-between items-center pl-1">
                    <label className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase">Bạch văn (Kết quả tìm được)</label>
                    {result && (
                        <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(result)}
                            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376A8.965 8.965 0 0012 12.75c-.497 0-.982.04-1.455.12l-.179.032m8.667 4.342a7.465 7.465 0 01-4.29-4.29m4.3 4.29a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25h-6.75a2.25 2.25 0 00-2.25 2.25v3.375" />
                            </svg>
                            Sao chép
                        </button>
                    )}
                </div>

                <div className="w-full min-h-[56px] p-1 text-xl font-black tracking-wide text-slate-900 uppercase break-words select-all">
                    {result ? (
                        <span className="font-mono bg-white border border-slate-100 rounded-xl px-2 py-1 shadow-2xs">{result}</span>
                    ) : (
                        <span className="text-slate-400 font-medium normal-case italic text-sm">Các chữ ẩn giấu sau khi giải mã sẽ hiển thị tại đây...</span>
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