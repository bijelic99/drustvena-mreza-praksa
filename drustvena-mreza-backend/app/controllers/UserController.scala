package controllers

import dto.{ChangePasswordData, LoggedInUserData, NewUser, UserCredentials}
import javax.inject.Inject
import play.api.mvc.{AbstractController, AnyContentAsJson, ControllerComponents, Request}
import repository.Repository
import model.User
import play.api.libs.json.Json
import services.UserService
import util.{JwtUtility, UUIDParser}
import actions.AuthAction

import scala.concurrent.{ExecutionContext, Future}

class UserController @Inject()(auth: AuthAction, controllerComponents: ControllerComponents, userService: UserService, jwtUtil: JwtUtility)(implicit ec: ExecutionContext)
  extends AbstractController(controllerComponents) {

  def getAllUsers() = auth.AuthAction.async { implicit request =>
    request.getQueryString("search").fold{
      userService.getAllUsers().map(x => Ok(Json.toJson(x)))
    }{ search =>
      userService.getUsers(search).map(x => Ok(Json.toJson(x)))
    }
  }

  def getUser(userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { uuid =>
      userService.getById(uuid)
        .map(x => x.fold(NotFound("User not found")) { u =>
          Ok(Json.toJson(u))
        })
    }

  }


  def addUser() = Action.async { implicit request =>

    val json = request.body.asJson.get
    val user = json.as[NewUser]
    userService
      .add(User(username = user.username, password = user.password, email = user.email, firstName = user.firstName, lastName = user.lastName))
      .map(u => Ok(Json.toJson(u)))
  }

  def updateUser() = auth.AuthAction.async { implicit request =>
    val json = request.body.asJson.get
    val user = json.as[User]
    userService.update(user).map(_ => Ok)
  }

  def deleteUser(userId: String) = auth.AuthAction.async { implicit request =>
    UUIDParser.parseUuidFromString(userId)
      .fold(Future(NotFound("Id invalid"))) { uuid =>
        userService.delete(uuid).map(_ => Ok)
      }
  }

  def isEmailUnique(email: String) = Action.async {
    userService.isEmailUnique(email).map(x => Ok(Json.toJson(x)))
  }

  def isUsernameUnique(username: String) = Action.async {
    userService.isUsernameUnique(username).map(x => Ok(Json.toJson(x)))
  }

  def login() = Action.async { implicit request =>
    val json = request.body.asJson.get
    val credentials = json.as[UserCredentials]
    userService.login(credentials.username, credentials.password).map { optUser =>
      optUser.fold(BadRequest("Wrong username or password")) { user =>
        //TODO dodati token na ovom mestu

        val data = LoggedInUserData(user, jwtUtil.createToken(user))
        Ok(Json.toJson(data))
      }
    }
  }

  def changePassword(id: String) = auth.AuthAction.async { implicit request =>
    val json = request.body.asJson.get
    val passwordData = json.as[ChangePasswordData]
    UUIDParser.parseUuidFromString(id).fold(Future(BadRequest("Id invalid"))) { userId =>
      userService.changePassword(userId, passwordData.currentPassword, passwordData.newPassword).map{ optUser =>
        optUser.fold(BadRequest("Password hasn't changed")){user =>
          Ok(Json.toJson(user))
        }
      }
    }
  }

}
