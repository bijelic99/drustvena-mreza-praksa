package controllers

import actions.AuthAction
import dto.NewFriendRequest
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import repository.Repository
import io.jvm.uuid.UUID
import model.{FriendRequest, Friendship}
import services.FriendRequestService
import util.UUIDParser

import scala.concurrent.{ExecutionContext, Future}

class FriendRequestController @Inject()(auth: AuthAction, controllerComponents: ControllerComponents, friendRequestService: FriendRequestService)(implicit ec: ExecutionContext)
  extends AbstractController(controllerComponents) {

  def getAllFriendRequests() = auth.AuthAction.async { implicit request =>
    friendRequestService.getAll.map(x => Ok(Json.toJson(x)))
  }

  def getFriendRequest(sender: String, recipient: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(sender).fold(Future(NotFound("Id invalid"))) { senderUuId =>
      UUIDParser.parseUuidFromString(recipient).fold(Future(NotFound("Id invalid"))) { recipientUuId =>
        friendRequestService.get(senderUuId, recipientUuId) map { opt =>
          opt.fold(NotFound("Friend request not found")) { fr => Ok(Json.toJson(fr)) }
        }

      }
    }
  }

  def addFriendRequest() = auth.AuthAction.async { implicit request =>

    val json = request.body.asJson.get
    val friendRequest = json.as[NewFriendRequest]
    friendRequestService
      .add(FriendRequest(sender = friendRequest.sender, recipient = friendRequest.recipient))
      .map(u => Ok(Json.toJson(u)))
  }


  def deleteFriendRequest(sender: String, recipient: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(sender).fold(Future(NotFound("Id invalid"))) { senderUuId =>
      UUIDParser.parseUuidFromString(recipient).fold(Future(NotFound("Id invalid"))) { recipientUuId =>
        friendRequestService.remove(senderUuId, recipientUuId)
          .map(_ => Ok)
      }
    }
  }

  def getUsersFriendRequests(userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { userUuid =>
      friendRequestService.getUsersFriendRequests(userUuid).map(x => Ok(Json.toJson(x)))
    }
  }

  def acceptFriendRequest() = auth.AuthAction.async { implicit request =>
    val json = request.body.asJson.get
    val friendRequest = json.as[FriendRequest]
    friendRequestService.acceptFriendRequest(friendRequest)
      .map(fspOpt => fspOpt.fold(InternalServerError("Int server err")) { fsp =>
        Ok(Json.toJson(fsp))
      })
  }
}
