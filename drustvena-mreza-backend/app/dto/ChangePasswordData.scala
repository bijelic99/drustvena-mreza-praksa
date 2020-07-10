package dto

import play.api.libs.json.Json

case class ChangePasswordData(currentPassword: String, newPassword: String)

object ChangePasswordData {
  implicit val changePasswordDataFormat = Json.format[ChangePasswordData]
}