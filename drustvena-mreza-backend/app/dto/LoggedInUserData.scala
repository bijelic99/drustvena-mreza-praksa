package dto

import model.User
import play.api.libs.json.Json

case class LoggedInUserData(user: User, token: String)

object LoggedInUserData {
  implicit val loggedInUserDataFormat = Json.format[LoggedInUserData]
}