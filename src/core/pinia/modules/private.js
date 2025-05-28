// 储存秘钥信息
import { defineStore } from 'pinia'
import { getInitInfo } from '@/api/init'
import { getItem, setItem } from '@/core/utils/storage' //getItem和setItem是封装的操作localStorage的方法
import { AES_GCM, string_to_bytes, hex_to_bytes, bytes_to_hex } from 'asmcrypto.js/dist_es8/entry-export_all'
import { localEncrypt } from '@/core/utils/encrypt'
export const usePrivate = defineStore('private', {
  state: () => {
    return {
      data: {
        iv: '',
        key: '',
      }
    }
  },
  actions: {
    getAesKey() {
      return this.data
    },
    async getKey(cb) {
      const { data } = await getInitInfo()
      // 获取成功写入本地存储中
      this.data.iv = localEncrypt.encryptByAES(data.security.iv)
      this.data.key = localEncrypt.encryptByAES(data.security.key)
      //console.log(this.data)
      setItem('pubKey', this.data)

      cb && cb(data)
    },
    aesEncode(str) {
      if (!str || str === 'undefined' || str === 'null') return str

      // if (str.indexOf('ktaescpc') == 0 || /^[0-9a-fA-F]+$/.test(str)) return str
      if (!this.data.iv || !this.data.key) {
        const AesKey = getItem('pubKey')
        this.data.iv = AesKey.iv
        this.data.key = AesKey.key
      }

      const pp = localEncrypt.decryptByAES(this.data.key)
      const vv = localEncrypt.decryptByAES(this.data.iv)

      const text_ = string_to_bytes(str, true)
      const key_ = hex_to_bytes(pp)
      const nonce = hex_to_bytes(vv)
      const encText = AES_GCM.encrypt(text_, key_, nonce, [])
      return bytes_to_hex(encText)
    },

    encryptStr() {
      return function(str) {
        if (!str) return str
        return str
      }
    }
  }
})
