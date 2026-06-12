import React, { useState, useEffect } from 'react';
import Toast from './Toast.jsx';

export default function DangChuongBo() {
    const [toast, setToast] = useState({ message: '', type: 'error' });
    const [showHelp, setShowHelp] = useState(false);
    const [message, setMessage] = useState([]); 
    const [result, setResult] = useState("");

    const [currentLines, setCurrentLines] = useState([]); 
    const [currentType, setCurrentType] = useState("straight"); 
    const [currentDot, setCurrentDot] = useState("none"); 
    // Định nghĩa bảng tra cứu Mật thư Chuồng (Bảng chữ cái chuẩn)
    const decryptCharacter = (char) => {
        if (char.isSpace) return " ";
        const lines = char.lines;
        const dot = char.dot;

        if (char.type === "straight") {
            // Chuồng thẳng (A-R)
            const hasT = lines.includes("top");
            const hasB = lines.includes("bottom");
            const hasL = lines.includes("left");
            const hasR = lines.includes("right");

            // Cấu trúc 9 ô chữ vuông cơ bản
            if (!hasT && hasB && !hasL && hasR) return dot === "right" ? "B" : "A"; // ⌟
            if (!hasT && hasB && hasL && hasR)  return dot === "right" ? "D" : "C"; // ⎱
            if (!hasT && hasB && hasL && !hasR) return dot === "right" ? "F" : "E"; // ⌞
            if (hasT && hasB && !hasL && hasR)  return dot === "right" ? "H" : "G"; // ⊏
            if (hasT && hasB && hasL && hasR)   return dot === "right" ? "J" : "I"; // ⌸
            if (hasT && hasB && hasL && !hasR)  return dot === "right" ? "L" : "K"; // ⊐
            if (hasT && !hasB && !hasL && hasR) return dot === "right" ? "N" : "M"; // ⌝
            if (hasT && !hasB && hasL && hasR)  return dot === "right" ? "P" : "O"; // ⎲
            if (hasT && !hasB && hasL && !hasR) return dot === "right" ? "R" : "Q"; // ⌜
        } else {
            // Chuồng chéo (S-Z)
            const hasTL = lines.includes("top-left");
            const hasTR = lines.includes("top-right");
            const hasBL = lines.includes("bottom-left");
            const hasBR = lines.includes("bottom-right");

            if (hasTL && hasTR) return dot === "right" ? "T" : "S"; // V trên
            if (hasBL && hasBR) return dot === "right" ? "V" : "U"; // ^ dưới
            if (hasTL && hasBL) return dot === "right" ? "X" : "W"; // > trái
            if (hasTR && hasBR) return dot === "right" ? "Z" : "Y"; // < phải
        }
        return "?";
    };

    // Tự động dịch nghĩa khi Bản tin hoặc Khoá thay đổi
    useEffect(() => {
        if (message.length === 0) {
            setResult("");
            return;
        }
        // Tạo chuỗi khoá ký tự dịch được (Ví dụ: "A B C")
        const messageString = message.map(char => decryptCharacter(char)).join("");

        // Nếu bản tin trống, hiện luôn chuỗi khoá vừa dựng để kiểm tra
        setResult(messageString);
    }, [message]);

    // Hàm xử lý vẽ SVG thông minh, tính toán đỉnh chụm động cho chuồng chéo
    const renderSvgElements = (type, lines, dot) => {
        const paths = [];
        let dotCx = 20; 
        let dotCy = 20; 

        if (type === "straight") {
            // 1. CHUỒNG VUÔNG (Giữ nguyên)
            if (lines.includes("top")) paths.push(<path key="top" d="M 5,5 L 35,5" />);
            if (lines.includes("bottom")) paths.push(<path key="bottom" d="M 5,35 L 35,35" />);
            if (lines.includes("left")) paths.push(<path key="left" d="M 5,5 L 5,35" />);
            if (lines.includes("right")) paths.push(<path key="right" d="M 35,5 L 35,35" />);
            
            if (dot === "left") dotCx = 14;
            if (dot === "right") dotCx = 26;
        } else {
            // 2. CHUỒNG CHÉO: CHỈ XỬ LÝ KHI ĐỦ ĐÚNG 2 NÉT KỀ NHAU
            const topLeft = "5,5";
            const topRight = "35,5";
            const bottomLeft = "5,35";
            const bottomRight = "35,35";

            const hasTL = lines.includes("top-left");
            const hasTR = lines.includes("top-right");
            const hasBL = lines.includes("bottom-left");
            const hasBR = lines.includes("bottom-right");

            if (hasTL && hasBL && lines.length === 2) {
            // Hình `<` (Đỉnh chạm biên phải 35,20)
            paths.push(<path key="v-left" d={`M ${topLeft} L 35,20 L ${bottomLeft}`} />);
            if (dot === "left") { dotCx = 13; dotCy = 20; }
            if (dot === "right") { dotCx = 23; dotCy = 20; } 
            } 
            else if (hasTR && hasBR && lines.length === 2) {
            // Hình `>` (Đỉnh chạm biên trái 5,20)
            paths.push(<path key="v-right" d={`M ${topRight} L 5,20 L ${bottomRight}`} />);
            if (dot === "left") { dotCx = 17; dotCy = 20; } 
            if (dot === "right") { dotCx = 27; dotCy = 20; } 
            } 
            else if (hasTL && hasTR && lines.length === 2) {
            // Hình `V` xuôi (Đỉnh chạm biên dưới 20,35)
            paths.push(<path key="v-top" d={`M ${topLeft} L 20,35 L ${topRight}`} />);
            if (dot === "left") { dotCx = 14; dotCy = 15; }
            if (dot === "right") { dotCx = 26; dotCy = 15; }
            } 
            else if (hasBL && hasBR && lines.length === 2) {
            // Hình `^` ngược (Đỉnh chạm biên trên 20,5)
            paths.push(<path key="v-bottom" d={`M ${bottomLeft} L 20,5 L ${bottomRight}`} />);
            if (dot === "left") { dotCx = 14; dotCy = 25; }
            if (dot === "right") { dotCx = 26; dotCy = 25; }
            } 
            else {
            // Nếu mới chọn 1 nét dở dang: Vẽ nét đứt mảnh (hoặc mờ) để định hướng, không vẽ đường xuyên tâm bừa bãi
            if (hasTL) paths.push(<path key="tl" d="M 5,5 L 20,20" strokeDasharray="2,2" />);
            if (hasTR) paths.push(<path key="tr" d="M 35,5 L 20,20" strokeDasharray="2,2" />);
            if (hasBL) paths.push(<path key="bl" d="M 5,35 L 20,20" strokeDasharray="2,2" />);
            if (hasBR) paths.push(<path key="br" d="M 35,35 L 20,20" strokeDasharray="2,2" />);
            
            if (dot === "left") dotCx = 14;
            if (dot === "right") dotCx = 26;
            }
        }

        const dotElement = dot !== "none" ? <circle cx={dotCx} cy={dotCy} r="3" fill="#f43f5e" /> : null;

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
        setCurrentLines([]);
        setCurrentDot("none");
    };

    const handleDirectionClick = (dir) => {
        if (currentLines.includes(dir)) {
            // Nếu nét đã chọn rồi -> Bấm lại thì bỏ chọn (Toggle)
            setCurrentLines(currentLines.filter(line => line !== dir));
        } else {
            // Nếu là chuồng chéo và chuẩn bị vượt quá 2 nét
            if (currentType === "diagonal" && currentLines.length >= 2) {
            // Tự động bỏ nét đầu tiên, chỉ giữ lại nét gần nhất và thêm nét mới vào
            // Cách này giúp người dùng không bao giờ chọn được nét thứ 3
            setCurrentLines([currentLines[1], dir]);
            } else {
            // Chuồng thẳng hoặc chuồng chéo chưa đủ 2 nét thì thêm bình thường
            setCurrentLines([...currentLines, dir]);
            }
        }
    };

    const handleAddSpace = () => {
        if (currentDot === "none" && currentLines.length === 2) {
            // Kích hoạt thông báo lỗi
            setToast({ 
                message: "Thiếu dấu chấm!", 
                type: "error" 
            });
            return;
        }
        if (currentLines.length === 1) {
            // Kích hoạt thông báo lỗi
            setToast({ 
                message: "Chọn ít nhất 2 cạnh!", 
                type: "error" 
            });
            return;
        }
        if(currentType === "straight" && currentLines.length === 2) {
            if(currentLines.includes("top") && currentLines.includes("bottom")) {
                setToast({ 
                    message: "Sai quy tắc dựng hình! Vui lòng kiểm tra lại các cạnh đối diện.",
                    type: "error" 
                });
                return;
            }
            if(currentLines.includes("left") && currentLines.includes("right")) {
                setToast({ 
                    message: "Sai quy tắc dựng hình! Vui lòng kiểm tra lại các cạnh đối diện.",
                    type: "error"
                });
                return;
            }
        }
        if (currentLines.length > 0 || currentDot !== "none") {
            const finishedChar = {
                type: currentType,
                lines: [...currentLines],
                dot: currentDot,
                isSpace: false,
                id: Date.now()
            };
            setMessage([...message, finishedChar]);
            setCurrentLines([]);
            setCurrentDot("none");
        } else {
            setMessage([...message, { isSpace: true, id: Date.now() }]);
        }
    };

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto p-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-indigo-600 rounded-full shadow-sm"></div>
                <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Mật Thư Dạng Chuồng Bò
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
                                “Pha-ra-ô làm mơ thấy mình đang đứng trên bờ sông Nin, và từ sông Nin có bảy con bò cái đi lên, hình dáng đẹp đẽ và da thịt béo tốt; chúng ăn cỏ trong đám lau sậy”
                            </blockquote>
                            <div className="mt-1.5 text-xs text-amber-700 font-bold flex items-center gap-1 pl-3">
                                <span>📍 Trích dẫn:</span>
                                <span className="bg-amber-100 px-2 py-0.5 rounded-md font-mono text-xs">Sách Sáng Thế (St 41, 18)</span>
                            </div>
                            <p className="mt-2 text-xs text-slate-500 font-normal">
                                * Gợi ý giải: Chữ <code className="font-mono bg-amber-100 !text-amber-800 px-1 rounded">bảy con bò cái</code> hướng người giải liên tưởng trực tiếp đến hệ thống mật mã hình <span className="font-bold text-slate-600">Chuồng Bò</span>.
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
                                <span>Chuồng thẳng (A - R): Chọn từ 2 đến 4 cạnh viền vuông để dựng khung chuồng.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">✦</span>
                                <span>Chuồng chéo (S - Z): Bắt buộc chọn đúng 2 nét kề cạnh để tạo góc nhọn (<code className="font-mono bg-slate-200 px-1 rounded">&lt;</code>, <code className="font-mono bg-slate-200 px-1 rounded">&gt;</code>, <code className="font-mono bg-slate-200 px-1 rounded">V</code>, <code className="font-mono bg-slate-200 px-1 rounded">^</code>). Nét đối diện sẽ tự động khóa để tránh tạo ký tự sai lỗi.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">✦</span>
                                <span>Dấu chấm đỏ: Thêm dấu chấm <span className="text-rose-500 font-bold">•</span> để phân định chữ thứ nhất hay chữ thứ hai nằm chung ô.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">✦</span>
                                <span>Bấm <strong className="text-indigo-600">Xác nhận ô</strong> để lưu ký tự và chuyển sang từ tiếp theo.</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Đường gạch ngăn mờ */}
                <div className="border-t border-slate-200/60 my-2"></div>

                {/* ================= PHẦN BẢNG TRA CỨU CHUỒNG BÒ ================= */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                            Bảng tra cứu Mật thư Chuồng Bò
                        </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-inner">
                        
                        {/* 1. CHUỒNG THẲNG (Hệ 9 ô vuông từ A - R) */}
                        <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 pr-0 sm:pr-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Chuồng Thẳng (A - R)</span>
                            <div className="grid grid-cols-3 w-full max-w-[150px] aspect-square text-center text-sm font-black text-slate-700">
                            {/* Hàng 1 */}
                            <div className="border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2">AB</div>
                            <div className="border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2">CD</div>
                            <div className="border-b-2 border-slate-300 flex items-center justify-center p-2">EF</div>
                            {/* Hàng 2 */}
                            <div className="border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2">GH</div>
                            <div className="border-b-2 border-r-2 border-slate-300 flex items-center justify-center p-2">IJ</div>
                            <div className="border-b-2 border-slate-300 flex items-center justify-center p-2">KL</div>
                            {/* Hàng 3 */}
                            <div className="border-r-2 border-slate-300 flex items-center justify-center p-2">MN</div>
                            <div className="border-r-2 border-slate-300 flex items-center justify-center p-2">OP</div>
                            <div className="flex items-center justify-center p-2">QR</div>
                            </div>
                        </div>

                        {/* 2. CHUỒNG CHÉO (Hệ chữ X từ S - Z) */}
                        <div className="flex flex-col items-center justify-center pt-2 sm:pt-0 pl-0 sm:pl-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wide">Chuồng Chéo (S - Z)</span>
                            <div className="relative w-full max-w-[150px] aspect-square flex items-center justify-center">
                            {/* Vẽ chữ X khít viền hoàn hảo */}
                            <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="2" y1="2" x2="98" y2="98" />
                                <line x1="98" y1="2" x2="2" y2="98" />
                            </svg>

                            {/* Cân bằng lại khoảng cách chữ trong lòng chữ X */}
                            <div className="absolute top-2 text-sm font-black text-slate-700 text-center">ST</div>
                            <div className="absolute bottom-2 text-sm font-black text-slate-700 text-center">UV</div>
                            <div className="absolute left-2 text-sm font-black text-slate-700 text-center">WX</div>
                            <div className="absolute right-2 text-sm font-black text-slate-700 text-center">YZ</div>
                            </div>
                        </div>

                        </div>
                    </div>

                    {/* ================= PHẦN VÍ DỤ MINH HỌA TRỰC QUAN ================= */}
                    <div className="flex flex-col gap-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide pl-0.5">
                        Ví dụ minh họa cách đọc:
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center text-sm font-medium text-slate-600">
                            {/* Ví dụ chữ A */}
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                    <svg width="100%" height="100%" viewBox="0 0 40 40" className="text-indigo-600"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="14" cy="20" r="3" fill="#f43f5e"></circle></svg>
                                </div>
                                <span className="text-xs font-bold text-slate-400">=</span>
                                <span className="font-black text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded-lg shadow-2xs">A</span>
                            </div>

                            {/* Ví dụ chữ I */}
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                    <svg width="100%" height="100%" viewBox="0 0 40 40" className="text-indigo-600"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="14" cy="20" r="3" fill="#f43f5e"></circle></svg>
                                </div>
                                <span className="text-xs font-bold text-slate-400">=</span>
                                <span className="font-black text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded-lg shadow-2xs">I</span>
                            </div>

                            {/* Ví dụ chữ S */}
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1">
                                    <svg width="100%" height="100%" viewBox="0 0 40 40" className="text-indigo-600"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 20,35 L 35,5"></path></g><circle cx="14" cy="15" r="3" fill="#f43f5e"></circle></svg>
                                </div>
                                <span className="text-xs font-bold text-slate-400">=</span>
                                <span className="font-black text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded-lg shadow-2xs">S</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      
        {/* 1. KHU VỰC HIỂN THỊ CHUỖI KHOÁ ĐÃ NHẬP */}
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center pl-1">
            <label className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                Bản Tin
            </label>
            {message.length > 0 && (
                <button 
                onClick={() => { setMessage([]); setCurrentLines([]); setCurrentDot("none"); }}
                className="text-[11px] font-bold text-red-500 uppercase hover:text-red-700 transition-colors"
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
                    <div class="flex flex-wrap gap-2.5 items-center text-indigo-600">
                        <span className="text-slate-400 text-sm pl-1 font-medium">Ví dụ: </span>
                        <div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 35,5 L 35,35"></path></g><circle cx="14" cy="20" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="14" cy="20" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 35,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="14" cy="20" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 20,35 L 35,5"></path></g><circle cx="26" cy="15" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,35 L 35,35"></path><path d="M 5,5 L 5,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="26" cy="20" r="3" fill="#f43f5e"></circle></svg></div><span class="text-xl font-black text-slate-300 px-1">/</span><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 20,35 L 35,5"></path></g><circle cx="26" cy="15" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,5"></path><path d="M 5,35 L 35,35"></path><path d="M 35,5 L 35,35"></path></g><circle cx="26" cy="20" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,35 L 20,5 L 35,35"></path></g><circle cx="14" cy="25" r="3" fill="#f43f5e"></circle></svg></div><div class="w-9 h-9 flex items-center justify-center border border-slate-200 bg-white rounded-xl shadow-sm p-1"><svg width="100%" height="100%" viewBox="0 0 40 40"><g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 5,5 L 35,20 L 5,35"></path></g><circle cx="13" cy="20" r="3" fill="#f43f5e"></circle></svg></div></div>
                // <span className="text-slate-400 text-sm pl-1 font-medium">Nhập bản tin vào đây...</span>
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
                className="ml-2 p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 shadow-sm transition-all flex-shrink-0"
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
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all ${currentType === "straight" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700"}`}
                >
                Chuồng thẳng (— |)
                </button>
                <button
                type="button"
                onClick={() => handleTypeChange("diagonal")}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-xl border transition-all ${currentType === "diagonal" ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700"}`}
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
                        className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all ${currentLines.includes(item.val) ? "bg-slate-800 border-slate-800 text-white shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
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
                            className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all 
                                ${isSelected 
                                ? "bg-slate-800 border-slate-800 text-white shadow-sm" 
                                : isOppositeSelected
                                    ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed opacity-50" // Trạng thái khi bị khóa
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                            {item.label} {currentLines.includes(item.val) && "✓"}
                            </button>
                        )
                    })}
                    </>
                )}
                </div>
            </div>

            {/* Chọn vị trí chấm */}
            <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chọn vị trí dấu chấm</span>
                <div className="grid grid-cols-3 gap-1.5">
                {[
                    { value: "none", label: "Không chấm" },
                    { value: "left", label: "Chấm Trái •" },
                    { value: "right", label: "• Chấm Phải" }
                ].map((item) => (
                    <button
                    key={item.value}
                    type="button"
                    onClick={() => setCurrentDot(item.value)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${currentDot === item.value ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                    >
                    {item.label}
                    </button>
                ))}
                </div>
            </div>
            </div>

            {/* Khung Xem Trước & Nút SPACE */}
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
                className="w-full mt-3 bg-indigo-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all hover:bg-indigo-700 active:scale-95 flex flex-col items-center justify-center"
            >
                <span className="tracking-wider text-sm font-black">Xác nhận ô / Chuyển chữ</span>
            </button>
            </div>

        </div>

        {/* ================= KHU VỰC BẠCH VĂN (KẾT QUẢ GIẢI MÃ) ================= */}
        <div className="flex flex-col gap-1.5 mt-2 rounded-2xl border border-indigo-100 p-4 bg-indigo-50/30 shadow-xs relative overflow-hidden">
            {/* Đường kẻ highlight trang trí mờ ở góc */}
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />

            <div className="flex justify-between items-center pl-1">
                <label className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase">
                Bạch văn (Kết quả tìm được)
                </label>
                
                {/* Thêm nút nhanh giúp người chơi Copy kết quả */}
                {result && (
                <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376A8.965 8.965 0 0012 12.75c-.497 0-.982.04-1.455.12l-.179.032m8.667 4.342a7.465 7.465 0 01-4.29-4.29m4.3 4.29a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25h-6.75a2.25 2.25 0 00-2.25 2.25v3.375" />
                    </svg>
                    Sao chép
                </button>
                )}
            </div>

            {/* Chuyển đổi từ textarea sang div tự động co giãn dòng, font monospace cực chất cho mật thư */}
            <div className="w-full min-h-[56px] p-1 text-xl font-black tracking-wide text-slate-900 uppercase break-words select-all">
                {result ? (
                <span className="font-mono">{result}</span>
                ) : (
                <span className="text-slate-400 font-medium normal-case italic text-sm">
                    Các chữ ẩn giấu sau khi giải mã sẽ hiển thị tại đây...
                </span>
                )}
            </div>
        </div>
        
        {/* Đặt Component Toast ở cuối cùng bên trong thẻ return chính */}
        <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ message: '', type: 'error' })} 
            duration={3000} // Tùy chỉnh thời gian biến mất nếu muốn (mặc định 3000ms)
        />
    </div>
  );
}