package controllers

import actions.AuthAction
import javax.inject.Inject
import model.StatusLike
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import repository.Repository
import io.jvm.uuid.UUID
import services.StatusLikeService
import util.UUIDParser

import scala.concurrent.{ExecutionContext, Future}

class StatusLikeController @Inject()(auth: AuthAction, controllerComponents: ControllerComponents, statusLikeService: StatusLikeService)(implicit ec: ExecutionContext)
  extends AbstractController(controllerComponents) {

  def getAllStatusLikes() = Action.async { implicit request =>
    statusLikeService.getAll.map(x => Ok(Json.toJson(x)))
  }

  def getStatusLike(statusId: String, userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(statusId).fold(Future(NotFound("Id invalid"))) { statusUuid =>
      UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { userUuid =>
        statusLikeService.get(statusUuid, userUuid).map { opt =>
          opt.fold(NotFound("Id invalid"))(statusLike => Ok(Json.toJson(statusLike)))
        }
      }
    }
  }

  def addStatusLike() = auth.AuthAction.async { implicit request =>
    val json = request.body.asJson.get
    val statusLike = json.as[StatusLike]
    statusLikeService
      .add(StatusLike(statusId = statusLike.statusId, userId = statusLike.userId))
      .map(u => Ok(Json.toJson(u)))
  }


  def deleteStatusLike(statusId: String, userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(statusId).fold(Future(NotFound("Id invalid"))) { statusUuid =>
      UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { userUuid =>
        statusLikeService.delete(statusUuid, userUuid)
          .map(_ => Ok)

      }
    }
  }

  def getUsersStatusLikes(userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { userUuid =>
      statusLikeService.getUsersStatusLikes(userUuid).map(sl => Ok(Json.toJson(sl)))
    }
  }
}
