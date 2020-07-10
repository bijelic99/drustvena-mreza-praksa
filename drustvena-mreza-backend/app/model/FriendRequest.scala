package model

import java.time.LocalDateTime

import io.jvm.uuid.UUID
import play.api.libs.json.Json

case class FriendRequest(
                          sender: UUID,
                          recipient: UUID,
                          sentAt: LocalDateTime = LocalDateTime.now()
                        )

object FriendRequest {
  implicit val friendRequest = Json.format[FriendRequest]
}
