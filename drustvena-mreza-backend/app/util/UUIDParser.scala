package util

import java.util.Optional

import io.jvm.uuid._


object UUIDParser {
  def parseUuidFromString(string: String) = {
    try {
      Option(UUID(string))
    }
    catch {
      case _: IllegalArgumentException => Option.empty[UUID]
    }
  }


}
