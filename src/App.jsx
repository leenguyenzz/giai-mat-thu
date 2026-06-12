import Morse from './component/Morse.jsx'
import DangDoiDao from './component/DangDoiDao.jsx'
import DangCamRanh from './component/DangCamRanh.jsx'
import DangKyTuThayTu from './component/DangKyTuThayTu.jsx'
import DangKyTuThayKyTu from './component/DangKyTuThayKyTu.jsx'
import DangTuThayKyTu from './component/DangTuThayKyTu.jsx'
import DangMaPhuong from './component/DangMaPhuong.jsx'
import DangChuongBo from './component/DangChuongBo.jsx'
import DangChuongHeo1 from './component/DangChuongHeo1.jsx'
import DangChuongHeo2 from './component/DangChuongHeo2.jsx'
import DangChuongBoCau from './component/DangChuongBoCau.jsx'

import { useState } from 'react'

function App() {
  const title = 'Morse Code Translator'
  const [gameState, setGameState] = useState('start')
  const mapGame = {
    morse: <Morse />,
    kyTuThayTuKyTu: <DangKyTuThayKyTu />,
    doiDao: <DangDoiDao />,
    camRanh: <DangCamRanh />,
    kyTuThayTu: <DangKyTuThayTu />,
    tuThayKyTu: <DangTuThayKyTu />,
    maPhuong: <DangMaPhuong />,
    chuongBo: <DangChuongBo />,
    chuongHeo1: <DangChuongHeo1 />,
    chuongHeo2: <DangChuongHeo2 />,
    chuongBoCau: <DangChuongBoCau />
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-indigo-200/30 py-16 px-4 font-sans antialiased">
      {/* Cụm Tiêu đề */}
      <div className="text-center mb-12">
        <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
          {title}
        </div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          Hệ thống giải mã mật mã chuyên nghiệp
        </p>
      </div>
      
      {/* Container chính bọc toàn bộ App */}
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        
        {/* Bộ chọn dạng mật thư (Card cao cấp) */}
        <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 flex flex-col gap-3 group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60">
          <label className="text-xs font-bold text-indigo-600/80 tracking-widest uppercase pl-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Chọn dạng mật thư
          </label>
          
          <div className="relative">
            <select 
              className="w-full appearance-none bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-12 text-base font-bold text-slate-800 shadow-sm cursor-pointer transition-all duration-300 outline-none hover:border-indigo-400 hover:bg-slate-50/50 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              onChange={(e) => setGameState(e.target.value)} 
              value={gameState}
            >
              <option value="morse">Mật thư Morse</option>
              <option value="doiDao">Mật thư Dạng Đổi - Đảo</option>
              <option value="camRanh">Mật thư Cam Ranh</option>
              <option value="kyTuThayTuKyTu">Mật thư Ký Tự Thay Ký Tự</option>
              <option value="kyTuThayTu">Mật thư Ký Tự Thay Từ</option>
              <option value="tuThayKyTu">Mật thư Từ Thay Ký Tự</option>
              <option value="maPhuong">Mật thư Ma Phương</option>
              <option value="chuongBo">Mật thư Chuồng Bò</option>
              <option value="chuongHeo1">Mật thư Chuồng Heo 1</option>
              <option value="chuongHeo2">Mật thư Chuồng Heo 2</option>
              <option value="chuongBoCau">Mật thư Chuồng Bò Câu</option>
            </select>
            
            {/* Icon mũi tên Chevron hiện đại */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4.5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300">
              <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Vùng hiển thị nội dung Trò chơi / Giải mã */}
        <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-300">
          {mapGame[gameState]}
        </div>

      </div>
    </div>
  )
}

export default App
