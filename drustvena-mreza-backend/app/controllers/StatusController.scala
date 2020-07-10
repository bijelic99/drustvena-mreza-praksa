package controllers


import actions.AuthAction
import dto.NewStatus
import io.jvm.uuid.UUID
import javax.inject.Inject
import model.{Status => StatusModelCaseClass}
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import repository.Repository
import services.StatusService
import util.UUIDParser

import scala.concurrent.{ExecutionContext, Future}

class StatusController @Inject()(auth: AuthAction, controllerComponents: ControllerComponents, statusService: StatusService, repository: Repository)(implicit ec: ExecutionContext)
  extends AbstractController(controllerComponents) {
  def getAllStatuses() = auth.AuthAction.async { implicit request =>
    statusService.getAll.map(x => Ok(Json.toJson(x)))
  }

  def getStatus(statusId: String) = auth.AuthAction.async { implicit request =>

    UUIDParser.parseUuidFromString(statusId).fold(Future(NotFound("Id invalid"))) { uuid =>
      statusService.get(uuid)
        .map(x => x.fold(NotFound("User not found"))(status => Ok(Json.toJson(status))))
    }
  }


  def addStatus() = auth.AuthAction.async { implicit request =>

    val json = request.body.asJson.get
    val newStatus = json.as[NewStatus]
    statusService
      .add(StatusModelCaseClass(userId = newStatus.userId, contents = newStatus.contents))
      .map(u => Ok(Json.toJson(u)))
  }

  def updateStatus() = auth.AuthAction.async { implicit request =>
    val json = request.body.asJson.get
    val status = json.as[StatusModelCaseClass]
    statusService.update(status).map(_ => Ok)
  }

  def deleteStatus(statusId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(statusId).fold(Future(NotFound("Id invalid"))) { uuid =>
      statusService.delete(uuid).map(_ => Ok)
    }
  }

  def getUsersFriendsStatuses(userId: String) = auth.AuthAction.async {
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { uuid =>
      statusService.getUsersFriendsStatuses(uuid).map( statuses => Ok(Json.toJson(statuses)))
    }
  }

  def getUsersStatuses(userId: String) = auth.AuthAction.async {
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { uuid =>
      statusService.getUsersStatuses(uuid).map(statuses => Ok(Json.toJson(statuses)))
    }
  }
}
