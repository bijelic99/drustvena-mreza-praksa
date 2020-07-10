package model

import io.jvm.uuid._
import play.api.libs.json.Json

case class StatusLike(
                       statusId: UUID,
                       userId: UUID
                     )
object StatusLike {
  implicit val statusLikeFormat = Json.format[StatusLike]
}
