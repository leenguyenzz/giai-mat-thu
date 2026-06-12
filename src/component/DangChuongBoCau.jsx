import React, { useState, useEffect } from 'react';
import Toast from './Toast.jsx';

// -------------------------------------------------------------------------
// HÀM HELPER & BẢNG MA TRẬN PHỤC VỤ GIẢI MÃ CHUỒNG BỒ CÂU
// -------------------------------------------------------------------------

const getLinesKey = (lines) => [...lines].sort().join(",");

// LƯỚI 1: Chuồng thẳng (A - I)
const STRAIGHT_MATRIX = {
    [getLinesKey(["bottom", "right"])]: "A",
    [getLinesKey(["bottom", "left", "right"])]: "B",
    [getLinesKey(["bottom", "left"])]: "C",
    [getLinesKey(["top", "bottom", "right"])]: "D",
    [getLinesKey(["top", "bottom", "left", "right"])]: "E",
    [getLinesKey(["top", "bottom", "left"])]: "F",
    [getLinesKey(["top", "right"])]: "G",
    [getLinesKey(["top", "left", "right"])]: "H",
    [getLinesKey(["top", "left"])]: "I"
};

// LƯỚI 2: Chuồng chéo vòng cung thiết kế theo 4 đường cong đối diện (J - R)
const DIAGONAL_CIRCLE_MATRIX = {
    [getLinesKey(["curve-top"])]: "J",
    [getLinesKey(["curve-left"])]: "M",
    [getLinesKey(["curve-right"])]: "O",
    [getLinesKey(["curve-bottom"])]: "P",
    // Chữ N được dệt nên từ sự giao thoa của cả 4 đường cong
    [getLinesKey(["curve-top", "curve-bottom", "curve-left", "curve-right"])]: "N",
    // 4 Góc chéo phụ do giao điểm của 2 đường biên kề nhau tạo thành
    [getLinesKey(["curve-top", "curve-left"])]: "K",
    [getLinesKey(["curve-top", "curve-right"])]: "L",
    [getLinesKey(["curve-bottom", "curve-left"])]: "Q",
    [getLinesKey(["curve-bottom", "curve-right"])]: "R"
};

// LƯỚI 3: Chuồng đuôi bồ câu khuyết / đan chéo dài (S - Z)
const PIGEON_TAIL_MATRIX = {
    [getLinesKey(["top-left", "top-right"])]: "S",
    [getLinesKey(["bottom-left", "bottom-right"])]: "Y",
    [getLinesKey(["top-left", "bottom-right"])]: "T",
    [getLinesKey(["bottom-left", "top-right"])]: "U",
    [getLinesKey(["top-left", "bottom-left"])]: "V",
    [getLinesKey(["top-right", "bottom-right"])]: "W",
    [getLinesKey(["bottom-left", "top-right", "bottom-right"])]: "X",
    [getLinesKey(["top-left", "top-right", "bottom-right"])]: "Z"
};

const decodePigeonCipher = (type, lines) => {
    if (!lines || lines.length === 0) return "";
    const key = getLinesKey(lines);

    if (type === "straight") return STRAIGHT_MATRIX[key] || "?";
    if (type === "diagonal") return DIAGONAL_CIRCLE_MATRIX[key] || "?";
    if (type === "pigeon-tail") return PIGEON_TAIL_MATRIX[key] || "?";
    return "?";
};

// -------------------------------------------------------------------------
// COMPONENT CHÍNH
// -------------------------------------------------------------------------
export default function DangChuongBoCau() {
    const [toast, setToast] = useState({ message: '', type: 'error' });
    const [showHelp, setShowHelp] = useState(false);
    const [message, setMessage] = useState([]); 
    const [result, setResult] = useState("");

    const [currentType, setCurrentType] = useState("straight"); 
    const [currentLines, setCurrentLines] = useState([]); 

    useEffect(() => {
        if (message.length === 0) {
            setResult("");
            return;
        }
        const decoded = message.map(char => char.isSpace ? " " : decodePigeonCipher(char.type, char.lines)).join("");
        setResult(decoded);
    }, [message]);

    // Hàm render chuẩn hóa giao diện hình ảnh tương ứng với từng dạng chuồng
    const renderSvgElements = (type, lines) => {
    const paths = [];
    const topLeft = "5,5", topRight = "35,5", bottomLeft = "5,35", bottomRight = "35,35";

    // 1. CHUỒNG THẲNG (A - I)
    if (type === "straight") {
        if (lines.includes("top"))    paths.push(<path key="top" d="M 5,5 L 35,5" />);
        if (lines.includes("bottom")) paths.push(<path key="bottom" d="M 5,35 L 35,35" />);
        if (lines.includes("left"))   paths.push(<path key="left" d="M 5,5 L 5,35" />);
        if (lines.includes("right"))  paths.push(<path key="right" d="M 35,5 L 35,35" />);
    } 
    // 2. CHUỒNG CHÉO 4 CUNG TRÒN PHÂN ĐOẠN GIAO THOA (J - R)
    else if (type === "diagonal") {
        const hasT = lines.includes("curve-top");
        const hasB = lines.includes("curve-bottom");
        const hasL = lines.includes("curve-left");
        const hasR = lines.includes("curve-right");

        // Đếm số lượng nét đang được chọn
        const count = lines.length;

        // TRƯỜNG HỢP 1: CHỮ N (Chọn cả 4 đường) -> Vẽ hình thoi khép kín ở tâm
        if (count === 4) {
            paths.push(
                <path key="n-center" d="M 17.5,13 A 30,30 0 0,1 22.5,13 A 30,30 0 0,1 27,17.5 A 30,30 0 0,1 27,22.5 A 30,30 0 0,1 22.5,27 A 30,30 0 0,1 17.5,27 A 30,30 0 0,1 13,22.5 A 30,30 0 0,1 13,17.5 Z" />
            );
        }
        // TRƯỜNG HỢP 2: CÁC GÓC BIÊN CHÉO (Chọn 2 đường kề nhau: K, L, Q, R)
        else if (count === 2) {
            // Chữ L (Trên + Phải) -> Chỉ lấy 2 đoạn đuôi giao nhau ở góc trên bên phải
            if (hasT && hasR) {
                paths.push(<path key="l-1" d="M 27,17.5 A 30,30 0 0,0 35,13" />); // Đoạn của nét trên
                paths.push(<path key="l-2" d="M 27,5 A 30,30 0 0,0 27,17.5" />);  // Đoạn của nét phải
            }
            // Chữ K (Trên + Trái) -> Góc trên bên trái
            else if (hasT && hasL) {
                paths.push(<path key="k-1" d="M 5,13 A 30,30 0 0,0 13,17.5" />);
                paths.push(<path key="k-2" d="M 13,5 A 30,30 0 0,1 13,17.5" />);
            }
            // Chữ R (Dưới + Phải) -> Góc dưới bên phải
            else if (hasB && hasR) {
                paths.push(<path key="r-1" d="M 27,22.5 A 30,30 0 0,1 35,27" />);
                paths.push(<path key="r-2" d="M 27,22.5 A 30,30 0 0,0 27,35" />);
            }
            // Chữ Q (Dưới + Trái) -> Góc dưới bên trái
            else if (hasB && hasL) {
                paths.push(<path key="q-1" d="M 5,27 A 30,30 0 0,1 13,22.5" />);
                paths.push(<path key="q-2" d="M 13,22.5 A 30,30 0 0,1 13,35" />);
            }
            // Các trường hợp đối diện ngẫu nhiên (Trên+Dưới hoặc Trái+Phải) nếu người dùng bấm chọn giải trí
            else {
                if (hasT) paths.push(<path key="t-full" d="M 5,13 A 30,30 0 0,0 35,13" />);
                if (hasB) paths.push(<path key="b-full" d="M 5,27 A 30,30 0 0,1 35,27" />);
                if (hasL) paths.push(<path key="l-full" d="M 13,5 A 30,30 0 0,1 13,35" />);
                if (hasR) paths.push(<path key="r-full" d="M 27,5 A 30,30 0 0,0 27,35" />);
            }
        }
        // TRƯỜNG HỢP 3: CÁC CÁNH CUNG ĐƠN LẺ (Chọn 1 đường duy nhất: J, M, O, P)
        // Khi chỉ chọn 1 đường, ta chỉ vẽ "bụng" đường cong nằm ở khoảng giữa 2 giao điểm
        else if (count === 1) {
            if (hasT) paths.push(<path key="j-mid" d="M 13,13 A 30,30 0 0,0 27,13" />);  // Bụng Trên (J)
            if (hasL) paths.push(<path key="m-mid" d="M 13,13 A 30,30 0 0,1 13,27" />);  // Bụng Trái (M)
            if (hasR) paths.push(<path key="o-mid" d="M 27,13 A 30,30 0 0,0 27,27" />);  // Bụng Phải (O)
            if (hasB) paths.push(<path key="p-mid" d="M 13,27 A 30,30 0 0,1 27,27" />);  // Bụng Dưới (P)
        }
        // TRƯỜNG HỢP 4: Người dùng đang bấm dở 3 đường (Hiển thị toàn bộ các nét đã chọn để họ nhìn thấy trực quan)
        else {
            if (hasL) paths.push(<path key="c-l" d="M 13,5 A 30,30 0 0,1 13,35" />);
            if (hasR) paths.push(<path key="c-r" d="M 27,5 A 30,30 0 0,0 27,35" />);
            if (hasT) paths.push(<path key="c-t" d="M 5,13 A 30,30 0 0,0 35,13" />);
            if (hasB) paths.push(<path key="c-b" d="M 5,27 A 30,30 0 0,1 35,27" />);
        }
    }
    // 3. CHUỒNG ĐUÔI BỒ CÂU KHUYẾT (S - Z)
    else if (type === "pigeon-tail") {
        const hasTL = lines.includes("top-left");
        const hasTR = lines.includes("top-right");
        const hasBL = lines.includes("bottom-left");
        const hasBR = lines.includes("bottom-right");

        if (hasTL && hasTR && lines.length === 2) {
            paths.push(<path key="p-s" d={`M ${topLeft} L 20,35 L ${topRight}`} />);
        } else if (hasBL && hasBR && lines.length === 2) {
            paths.push(<path key="p-y" d={`M ${bottomLeft} L 20,5 L ${bottomRight}`} />);
        } else if (hasTL && hasBR) {
            paths.push(<path key="p-t" d={`M ${topLeft} L ${bottomRight}`} />);
        } else if (hasBL && hasTR) {
            paths.push(<path key="p-u" d={`M ${bottomLeft} L ${topRight}`} />);
        } else {
            if (hasTL) paths.push(<path key="ptl" d={`M ${topLeft} L 20,20`} strokeDasharray={lines.length < 2 ? "2,2" : "none"} />);
            if (hasTR) paths.push(<path key="ptr" d={`M ${topRight} L 20,20`} strokeDasharray={lines.length < 2 ? "2,2" : "none"} />);
            if (hasBL) paths.push(<path key="pbl" d={`M ${bottomLeft} L 20,20`} strokeDasharray={lines.length < 2 ? "2,2" : "none"} />);
            if (hasBR) paths.push(<path key="pbr" d={`M ${bottomRight} L 20,20`} strokeDasharray={lines.length < 2 ? "2,2" : "none"} />);
        }
    }

    return (
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {paths}
        </g>
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
            setMessage([...message, { isSpace: true, id: Date.now() }]);
            return;
        }

        const checkChar = decodePigeonCipher(currentType, currentLines);
        if (checkChar === "?") {
            setToast({ message: "Tổ hợp nét hiện tại không khớp với ký tự Chuồng Bồ Câu nào!", type: "error" });
            return;
        }

        setMessage([...message, { type: currentType, lines: [...currentLines], isSpace: false, id: Date.now() }]);
        setCurrentLines([]);
    };

    return (
        <div className="flex flex-col gap-4 max-w-xl mx-auto p-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-5 bg-emerald-600 rounded-full shadow-sm"></div>
                    <header className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        Mật Thư Chuồng Bồ Câu
                    </header>
                </div>
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${showHelp ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                >
                    <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                </button>
            </div>

            {/* Hướng dẫn tra cứu */}
            {showHelp && (
                <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-4 shadow-inner animate-fadeIn">
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 font-medium">
                        <strong>🔑 Kinh Thánh (OTT):</strong> “Ông lại đợi thêm bảy ngày, rồi thả con bồ câu ra, nhưng nó không trở về với ông nữa” (St 8, 12).
                    </div>
                    
                    <p className="font-semibold text-slate-900 mb-1">💡 Bản Đồ Tra Cứu Ba Hệ Chuồng:</p>
                    
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center my-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                        
                        {/* CHUỒNG 1: LƯỚI VUÔNG (A - I) */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">1. Lưới Vuông (A - I)</span>
                            <svg width="120" height="120" viewBox="0 0 120 120" className="text-slate-800">
                                <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="40" y1="5" x2="40" y2="115" />
                                    <line x1="80" y1="5" x2="80" y2="115" />
                                    <line x1="5" y1="40" x2="115" y2="40" />
                                    <line x1="5" y1="80" x2="115" y2="80" />
                                </g>
                                <g fill="currentColor" textAnchor="middle" dominantBaseline="central" className="text-[14px] font-bold opacity-40">
                                    <text x="20" y="20">A</text> <text x="60" y="20">B</text> <text x="100" y="20">C</text>
                                    <text x="20" y="60">D</text> <text x="60" y="60">E</text> <text x="100" y="60">F</text>
                                    <text x="20" y="100">G</text><text x="60" y="100">H</text><text x="100" y="100">I</text>
                                </g>
                            </svg>
                        </div>

                        {/* CHUỒNG 2: LƯỚI TÂM TRÒN (J - R) */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">2. Lưới Tâm Tròn (J - R)</span>
                            <svg width="120" height="120" viewBox="0 0 120 120" className="text-slate-800">
                                <g stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
                                    <path d="M 40,15 A 90,90 0 0,1 40,105" />
                                    <path d="M 80,15 A 90,90 0 0,0 80,105" />
                                    <path d="M 15,40 A 90,90 0 0,0 105,40" />
                                    <path d="M 15,80 A 90,90 0 0,1 105,80" />
                                </g>
                                <g fill="currentColor" textAnchor="middle" dominantBaseline="central" className="text-[13px] font-bold">
                                    <text x="60" y="24" className="fill-slate-600">J</text>
                                    <text x="24" y="60" className="fill-slate-600">M</text>
                                    <text x="60" y="60" className="fill-emerald-600 font-black text-[15px]">N</text>
                                    <text x="96" y="60" className="fill-slate-600">O</text>
                                    <text x="60" y="96" className="fill-slate-600">P</text>
                                    <text x="26" y="26" className="fill-slate-400 text-[11px]">K</text>
                                    <text x="94" y="26" className="fill-slate-400 text-[11px]">L</text>
                                    <text x="26" y="94" className="fill-slate-400 text-[11px]">Q</text>
                                    <text x="94" y="94" className="fill-slate-400 text-[11px]">R</text>
                                </g>
                            </svg>
                        </div>

                        {/* CHUỒNG 3: LƯỚI ĐUÔI KHUYẾT (S - Z) */}
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">3. Lưới Đuôi Khuyết (S - Z)</span>
                            <svg width="120" height="120" viewBox="0 0 120 120" className="text-slate-800">
                                <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="15" y1="15" x2="105" y2="105" />
                                    <line x1="15" y1="105" x2="105" y2="15" />
                                    <line x1="15" y1="15" x2="60" y2="105" />
                                    <line x1="105" y1="15" x2="60" y2="105" />
                                    <line x1="15" y1="105" x2="60" y2="15" />
                                    <line x1="105" y1="105" x2="60" y2="15" />
                                </g>
                                <g fill="currentColor" textAnchor="middle" dominantBaseline="central" className="text-[13px] font-bold opacity-40">
                                    <text x="60" y="22">S</text>
                                    <text x="30" y="42">T</text>  <text x="90" y="42">U</text>
                                    <text x="32" y="65">V</text>  <text x="88" y="65">W</text>
                                    <text x="60" y="55">X</text>
                                    <text x="60" y="98">Y</text>  <text x="60" y="76">Z</text>
                                </g>
                            </svg>
                        </div>

                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px]">
                        <div className="p-2 bg-white rounded-xl border border-slate-150">
                            <strong className="text-slate-900 block mb-0.5">Lưới 1 (A - I):</strong> Ghép các đường biên vuông góc bao quanh chữ.
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-150">
                            <strong className="text-slate-900 block mb-0.5">Lưới 2 (J - R):</strong> 4 đường cong lùi biên 2/3 đan vào nhau. Chữ N nằm ở giao điểm tâm của cả 4 đường.
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-slate-150">
                            <strong className="text-slate-900 block mb-0.5">Lưới 3 (S - Z):</strong> Dựa vào các góc nhọn giao thoa hoặc các đường chéo song song cắt dài.
                        </div>
                    </div>
                </div>
            )}

            {/* KHU VỰC BẢN TIN */}
            <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Bản Tin Đang Nhập</span>
                <div className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 min-h-[80px] flex items-center justify-between shadow-lg">
                    <div className="flex flex-wrap gap-3 items-center">
                        {message.length > 0 || currentLines.length > 0 ? (
                            <>
                                {message.map((char) => char.isSpace ? (
                                    <span key={char.id} className="text-xl font-black text-emerald-500 px-1">/</span>
                                ) : (
                                    <div key={char.id} className="w-9 h-9 flex items-center justify-center border border-slate-700 bg-slate-800 rounded-xl p-1 text-emerald-400">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40">{renderSvgElements(char.type, char.lines)}</svg>
                                    </div>
                                ))}
                                {currentLines.length > 0 && (
                                    <div className="w-9 h-9 flex items-center justify-center border-2 border-dashed border-emerald-500 bg-emerald-950/40 rounded-xl p-1 animate-pulse text-emerald-400">
                                        <svg width="100%" height="100%" viewBox="0 0 40 40">{renderSvgElements(currentType, currentLines)}</svg>
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-slate-500 text-sm italic">Chọn hệ chuồng và nhấn các nét vẽ để dựng mật thư...</span>
                        )}
                    </div>
                    {/* Backspace */}
                    {(message.length > 0 || currentLines.length > 0) && (
                        <button 
                            onClick={() => currentLines.length > 0 ? setCurrentLines(currentLines.slice(0, -1)) : setMessage(message.slice(0, -1))}
                            className="p-2 bg-slate-800 text-slate-400 border border-slate-700 rounded-xl hover:text-white cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* BẢNG ĐIỀU KHIỂN NÉT VẼ */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                <div className="md:col-span-2 flex flex-col gap-3">
                    {/* Switch loại chuồng */}
                    <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl">
                        {[
                            { id: "straight", name: "Lưới Vuông (A-I)" },
                            { id: "diagonal", name: "Lưới Tâm Tròn (J-R)" },
                            { id: "pigeon-tail", name: "Lưới Đuôi Khuyết (S-Z)" }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => { setCurrentType(t.id); setCurrentLines([]); }}
                                className={`flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all cursor-pointer ${currentType === t.id ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>

                    {/* Danh sách nút bấm chọn nét tương ứng từng hệ */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chọn các nét cấu thành ô</span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {currentType === "straight" && [
                                { val: "top", label: "Mép Trên ‾" }, { val: "bottom", label: "Mép Dưới _" },
                                { val: "left", label: "Mép Trái |" }, { val: "right", label: "Mép Phải |" }
                            ].map(item => (
                                <button key={item.val} onClick={() => handleDirectionClick(item.val)} className={`py-2 text-xs font-bold border rounded-lg cursor-pointer ${currentLines.includes(item.val) ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>
                                    {item.label} {currentLines.includes(item.val) && "✓"}
                                </button>
                            ))}

                            {currentType === "diagonal" && [
                                { val: "curve-top", label: "Đường cong Trên (Chữ J)" },
                                { val: "curve-bottom", label: "Đường cong Dưới (Chữ P)" },
                                { val: "curve-left", label: "Đường cong Trái (Chữ M)" },
                                { val: "curve-right", label: "Đường cong Phải (Chữ O)" }
                            ].map(item => (
                                <button key={item.val} onClick={() => handleDirectionClick(item.val)} className={`py-2 text-xs font-bold border rounded-lg cursor-pointer ${currentLines.includes(item.val) ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>
                                    {item.label} {currentLines.includes(item.val) && "✓"}
                                </button>
                            ))}

                            {currentType === "pigeon-tail" && [
                                { val: "top-left", label: "Nét xiên Trên-Trái ↖" },
                                { val: "top-right", label: "Nét xiên Trên-Phải ↗" },
                                { val: "bottom-left", label: "Nét xiên Dưới-Trái ↙" },
                                { val: "bottom-right", label: "Nét xiên Dưới-Phải ↘" }
                            ].map(item => (
                                <button key={item.val} onClick={() => handleDirectionClick(item.val)} className={`py-2 text-xs font-bold border rounded-lg cursor-pointer ${currentLines.includes(item.val) ? "bg-slate-800 text-white" : "bg-white text-slate-600"}`}>
                                    {item.label} {currentLines.includes(item.val) && "✓"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview ô chữ đơn và nút Lưu */}
                <div className="flex flex-col items-center justify-between border border-dashed border-slate-200 bg-white rounded-2xl p-3">
                    <div className="text-center w-full">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Xem trước</span>
                        <div className="w-16 h-16 mx-auto border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-center text-slate-800">
                            <svg width="44" height="44" viewBox="0 0 40 40">{renderSvgElements(currentType, currentLines)}</svg>
                        </div>
                    </div>
                    <button
                        onClick={handleAddSpace}
                        className="w-full mt-2 bg-emerald-600 text-white text-xs font-black py-2.5 rounded-xl shadow-md hover:bg-emerald-700 cursor-pointer"
                    >
                        {currentLines.length === 0 ? "Thêm dấu cách [Space]" : "Xác nhận ô chữ"}
                    </button>
                </div>
            </div>

            {/* BẠCH VĂN DỊCH ĐƯỢC */}
            <div className="flex flex-col gap-1.5 rounded-2xl border border-emerald-100 p-4 bg-emerald-50/20 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">Bạch Văn Giải Mã</span>
                <div className="w-full min-h-[48px] text-xl font-mono font-black tracking-widest text-slate-900 uppercase">
                    {result ? (
                        <span className="bg-white border border-slate-200/60 rounded-xl px-3 py-1.5 shadow-xs inline-block">{result}</span>
                    ) : (
                        <span className="text-slate-400 font-medium font-sans normal-case italic text-xs">Chữ dịch tự động sẽ xuất hiện tại đây...</span>
                    )}
                </div>
            </div>

            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />
        </div>
    );
}