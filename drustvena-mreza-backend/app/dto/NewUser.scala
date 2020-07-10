package dto

import play.api.libs.json.Json

case class NewUser(username: String, password: String,
                   email: String, firstName: Option[String], lastName: Option[String])

object NewUser {
  implicit val newUserFormat = Json.format[NewUser]
}
