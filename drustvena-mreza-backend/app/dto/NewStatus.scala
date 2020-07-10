package dto

import play.api.libs.json.Json
import io.jvm.uuid.UUID

case class NewStatus(userId: UUID,
                     contents: String)

object NewStatus {
  implicit val newStatusFormat = Json.format[NewStatus]
}
