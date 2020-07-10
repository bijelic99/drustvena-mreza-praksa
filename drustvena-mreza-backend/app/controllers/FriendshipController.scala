package controllers

import actions.AuthAction
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import repository.Repository
import io.jvm.uuid.UUID
import model.{Friendship, StatusLike}
import services.FriendshipService
import util.UUIDParser

import scala.concurrent.{ExecutionContext, Future}

class FriendshipController @Inject()(auth: AuthAction, controllerComponents: ControllerComponents, friendshipService: FriendshipService)(implicit ec: ExecutionContext)
  extends AbstractController(controllerComponents) {

  def getAllFriendships() = auth.AuthAction.async { implicit request =>
    friendshipService.getAll.map(x => Ok(Json.toJson(x)))
  }

  def getFriendship(firstUserId: String, secondUserId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(firstUserId).fold(Future(NotFound("Id invalid"))) { firstUserUuid =>
      UUIDParser.parseUuidFromString(secondUserId).fold(Future(NotFound("Id invalid"))) { secondUserUuid =>
        friendshipService
          .get(firstUserUuid, secondUserUuid)
          .map(x => x.fold(NotFound("Friendship not found, stop making up fake friends"))(friendship => Ok(Json.toJson(friendship))))
      }
    }
  }

  def addFriendship() = auth.AuthAction.async { implicit request =>

    val json = request.body.asJson.get
    val friendship = json.as[Friendship]
    friendshipService
      .add(Friendship(firstUser = friendship.firstUser, secondUser = friendship.secondUser))
      .map(u => Ok(Json.toJson(u)))
  }


  def deleteFriendship(firstUserId: String, secondUserId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(firstUserId).fold(Future(NotFound("Id invalid"))) { firstUserUuid =>
      UUIDParser.parseUuidFromString(secondUserId).fold(Future(NotFound("Id invalid"))) { secondUserUuid =>
        friendshipService
          .deleteFriendship(firstUserUuid, secondUserUuid).map(_ => Ok)
      }
    }
  }

  def getUsersFriendships(userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { userUuid =>
      friendshipService.getUsersFriendships(userUuid).map { x => Ok(Json.toJson(x)) }
    }
  }

  def getUsersFriendshipsAsUsers(userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { userUuid =>
      friendshipService.getUsersFriendshipsAsUsers(userUuid).map { x => Ok(Json.toJson(x)) }
    }
  }
}
