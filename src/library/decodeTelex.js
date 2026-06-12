function decodeTelex(sentence) {
  const toneMap = {
    'a': { 's': 'á', 'f': 'à', 'r': 'ả', 'x': 'ã', 'j': 'ạ' },
    'ă': { 's': 'ắ', 'f': 'ằ', 'r': 'ẳ', 'x': 'ẵ', 'j': 'ặ' },
    'â': { 's': 'ấ', 'f': 'ầ', 'r': 'ẩ', 'x': 'ẫ', 'j': 'ậ' },
    'e': { 's': 'é', 'f': 'è', 'r': 'ẻ', 'x': 'ẽ', 'j': 'ẹ' },
    'ê': { 's': 'ế', 'f': 'ề', 'r': 'ể', 'x': 'ễ', 'j': 'ệ' },
    'i': { 's': 'í', 'f': 'ì', 'r': 'ỉ', 'x': 'ĩ', 'j': 'ị' },
    'o': { 's': 'ó', 'f': 'ò', 'r': 'ỏ', 'x': 'õ', 'j': 'ọ' },
    'ô': { 's': 'ố', 'f': 'ồ', 'r': 'ổ', 'x': 'ỗ', 'j': 'ộ' },
    'ơ': { 's': 'ớ', 'f': 'ờ', 'r': 'ở', 'x': 'ỡ', 'j': 'ợ' },
    'u': { 's': 'ú', 'f': 'ù', 'r': 'ủ', 'x': 'ũ', 'j': 'ụ' },
    'ư': { 's': 'ứ', 'f': 'ừ', 'r': 'ử', 'x': 'ữ', 'j': 'ự' },
    'y': { 's': 'ý', 'f': 'ỳ', 'r': 'ỷ', 'x': 'ỹ', 'j': 'ỵ' }
  };

  let words = sentence.split(' ');

  let decodedWords = words.map(word => {
    let isUpperCase = word === word.toUpperCase();
    let cleanWord = word.toLowerCase();

    let tone = '';
    let punc = '';
    let hasWModifier = false; // Biến kiểm tra xem cuối từ có chữ 'w' tạo dấu móc không

    // Bước 1: Tách ký tự đặc biệt (như !, ?, -) ở cuối ra trước
    let matchPunc = cleanWord.match(/([^a-zđăâêôơư]+)$/);
    if (matchPunc) {
      punc = matchPunc[1];
      cleanWord = cleanWord.substring(0, cleanWord.length - punc.length);
    }

    // Bước 2: Tách dấu Telex (s, f, r, x, j) và xử lý chữ 'w' đi kèm ở cuối từ (ví dụ: 'wgf', 'wf')
    let matchTone = cleanWord.match(/(w?)([sfrxj])$/);
    if (matchTone) {
      tone = matchTone[2]; // Lấy dấu thanh (s, f, r, x, j)
      if (matchTone[1] === 'w' || cleanWord.endsWith('w' + tone)) {
        hasWModifier = true; // Xác nhận từ này có chữ w đi kèm dấu ở cuối
      }
      // Cắt bỏ phần đuôi dấu (ví dụ: cắt 'wf' hoặc 'f')
      let tailLength = tone.length + (matchTone[1] === 'w' ? 1 : 0);
      cleanWord = cleanWord.substring(0, cleanWord.length - tailLength);
    } else if (cleanWord.endsWith('w')) {
      // Trường hợp kết thúc bằng 'w' đơn thuần không có dấu thanh kèm theo
      hasWModifier = true;
      cleanWord = cleanWord.substring(0, cleanWord.length - 1);
    }

    // Bước 3: Biến đổi các chữ đặc biệt Telex cơ bản ở thân chữ
    cleanWord = cleanWord.replace(/aa/g, 'â')
                         .replace(/ee/g, 'ê')
                         .replace(/oo/g, 'ô')
                         .replace(/dd/g, 'đ');

    // Nếu lúc nãy phát hiện đuôi có chữ 'w' ẩn, tiến hành áp dấu móc cho u, o hoặc a
    if (hasWModifier) {
      if (cleanWord.includes('uô')) {
        cleanWord = cleanWord.replace('uô', 'ươ');
      } else if (cleanWord.includes('uo')) {
        cleanWord = cleanWord.replace('uo', 'ươ');
      } else if (cleanWord.includes('u')) {
        cleanWord = cleanWord.replace('u', 'ư');
      } else if (cleanWord.includes('o')) {
        cleanWord = cleanWord.replace('o', 'ơ');
      } else if (cleanWord.includes('a')) {
        cleanWord = cleanWord.replace('a', 'ă');
      }
    }

    // Bước 4: Đặt dấu thanh vào đúng vị trí nguyên âm
    if (tone) {
      let vowels = cleanWord.match(/[aăâeêioôơuưy]/g);

      if (vowels) {
        let targetVowel = vowels[0];

        if (vowels.length > 1) {
          let vowelStr = vowels.join('');
          
          if (['ay', 'au', 'ây', 'êu', 'eo', 'ai', 'oi', 'ôi', 'ơi', 'ui', 'ưi'].includes(vowelStr)) {
            targetVowel = vowels[0];
          } else if (['ia', 'ua', 'ưa', 'iê', 'uô', 'ươ'].includes(vowelStr)) {
            let hasEndingConsonant = /[^aăâeêioôơuưy]$/.test(cleanWord);
            targetVowel = hasEndingConsonant ? vowels[1] : vowels[0];
          } else {
            targetVowel = vowels[vowels.length - 1];
          }
        }

        if (toneMap[targetVowel] && toneMap[targetVowel][tone]) {
          let markedVowel = toneMap[targetVowel][tone];
          let idx = cleanWord.lastIndexOf(targetVowel);
          cleanWord = cleanWord.substring(0, idx) + markedVowel + cleanWord.substring(idx + targetVowel.length);
        }
      }
    }

    let finalWord = cleanWord + punc;
    return isUpperCase ? finalWord.toUpperCase() : finalWord;
  });

  return decodedWords.join(' ');
}

export default decodeTelex