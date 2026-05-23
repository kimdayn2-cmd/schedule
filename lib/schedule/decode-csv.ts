/** Google Sheets CSV를 UTF-8로 안정적으로 디코딩 (BOM 제거) */
export function decodeCsvResponse(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)

  // UTF-8 BOM
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return new TextDecoder("utf-8").decode(bytes.slice(3))
  }

  let text = new TextDecoder("utf-8").decode(bytes)
  text = text.replace(/^\uFEFF/, "")

  // 헤더에 한글 컬럼이 없으면 Windows-1252 등 잘못된 디코딩 가능성 → 재시도 없음
  // (Google export는 UTF-8이 표준)
  return text
}
