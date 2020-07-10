package model

import java.time.LocalDateTime

import io.jvm.uuid._
import play.api.libs.json.Json

case class Friendship(
                       firstUser: UUID,
                       secondUser: UUID,
                       createdAt: LocalDateTime = LocalDateTime.now(),
                     )
object Friendship {
  implicit val friendshipFormat = Json.format[Friendship]
}
