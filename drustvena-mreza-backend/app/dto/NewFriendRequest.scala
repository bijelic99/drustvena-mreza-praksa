package dto

import io.jvm.uuid._
import play.api.libs.json.Json

case class NewFriendRequest(sender: UUID, recipient: UUID)

object NewFriendRequest {
  implicit val newFriendRequest = Json.format[NewFriendRequest]
}
