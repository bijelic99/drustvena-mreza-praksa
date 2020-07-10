package dto

import play.api.libs.json.Json

case class UserCredentials(username: String, password: String)

object UserCredentials {
  implicit val userCredentialsFormat = Json.format[UserCredentials]
}
