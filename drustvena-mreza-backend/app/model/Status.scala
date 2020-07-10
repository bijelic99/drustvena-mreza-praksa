package model

import java.time.LocalDateTime

import io.jvm.uuid.UUID
import play.api.libs.json.Json

case class Status(
                 id: Option[UUID] = Option.empty[UUID],
                 userId: UUID,
                 createdAt: LocalDateTime = LocalDateTime.now(),
                 contents: String
               )
object Status{
  implicit val statusFormat = Json.format[Status]
}