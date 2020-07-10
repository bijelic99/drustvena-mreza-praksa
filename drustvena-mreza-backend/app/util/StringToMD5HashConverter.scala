package util

import java.math.BigInteger
import java.security.MessageDigest

object StringToMD5HashConverter {
    private val messageDigest = MessageDigest.getInstance("MD5")

    def hashString(string: String) = {
      val byteHash = messageDigest.digest(string.getBytes)
      val bigInt = new BigInteger(1, byteHash)
      bigInt.toString(16)
    }
}
