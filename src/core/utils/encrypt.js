import { AES_GCM, string_to_bytes, bytes_to_string, bytes_to_base64, base64_to_bytes } from 'asmcrypto.js/dist_es8/entry-export_all'

const KEY_IV = {
  key: 'U8ENv6mckx49fJ@h',
  iv: 'x9Ujx8'
}

// AES加密和解密
 class AesGcm {
  constructor() {
    this.key = new Uint8Array(string_to_bytes(KEY_IV.key))
    const arrayRound = string_to_bytes(KEY_IV.iv)
    this.iv = new Uint8Array(arrayRound)
  }

  encryptByAES(txt) {
    const text_ = string_to_bytes(txt, true)
    const encText = AES_GCM.encrypt(text_, this.key, this.iv, [])
    return bytes_to_base64(encText)
  }

  decryptByAES(txt) {
    const text_ = base64_to_bytes(txt)
    const decText = AES_GCM.decrypt(text_, this.key, this.iv, [])
    return bytes_to_string(decText, true)
  }
}
const localEncrypt = new AesGcm()
export { localEncrypt }
