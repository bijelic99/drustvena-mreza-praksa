package dto

import java.time.LocalDateTime

import model.{Status, User}
import io.jvm.uuid.UUID
import play.api.libs.json.Json

case class ExpandedStatus(
                           id: Option[UUID] = Option.empty[UUID],
                           userId: UUID,
                           createdAt: LocalDateTime = LocalDateTime.now(),
                           contents: String,
                           user: Option[User]
                         )
object ExpandedStatus{
  implicit val expandedStatusFormat = Json.format[ExpandedStatus]
}