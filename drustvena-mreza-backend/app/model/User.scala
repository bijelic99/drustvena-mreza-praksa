package model

import java.time.LocalDateTime

import io.jvm.uuid.UUID
import play.api.libs.json.Json

case class User(
                 id: Option[UUID] = None,
                 username: String,
                 password: String,
                 firstName: Option[String] = Option.empty[String],
                 lastName: Option[String] = Option.empty[String],
                 email: String,
                 registeredAt: LocalDateTime = LocalDateTime.now()
               )
object User {
    implicit val userFormat = Json.format[User]
}