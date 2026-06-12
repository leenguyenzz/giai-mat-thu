function removeVietnameseTones(str) {
    return str
        .normalize("NFD") // Tách dấu ra khỏi chữ gốc
        .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
        .replace(/đ/g, "d") // Thay chữ đ thường
        .replace(/Đ/g, "D"); // Thay chữ Đ hoa
}

export default removeVietnameseTones;