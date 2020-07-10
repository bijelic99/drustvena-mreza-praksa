package model

import io.jvm.uuid._
import play.api.libs.json.Json

case class Photo(
                id: Option[UUID] = Option.empty[UUID],
                userId: UUID,
                picture: Array[Byte],
                mimeType: String = ""
                )
object Photo {
  implicit val photoFormat = Json.format[Photo]
}