package actions

import dto.UserCredentials
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ActionBuilder, AnyContent, BodyParser, BodyParsers, ControllerComponents, Request, Result}
import repository.Repository
import util.JwtUtility

import scala.concurrent.{ExecutionContext, Future}

class AuthAction @Inject()(repository: Repository, jwtUtil: JwtUtility, cc: ControllerComponents, bodyParser: BodyParsers.Default)
                          (implicit val ec: ExecutionContext) extends AbstractController(cc) {
  implicit val formatUserDetails = Json.format[UserCredentials]

  object AuthAction extends ActionBuilder[Request, AnyContent] {
    override def invokeBlock[A](request: Request[A], block: Request[A] => Future[Result]): Future[Result] = {
      val jwtToken = request.headers.get("Authorization").fold("")(x => x)
      jwtUtil.isTokenValid(jwtToken) match {
        case true => jwtUtil.decodePayload(jwtToken).map { co =>
          val credentials = co.get
          repository.userRepository.findUserByCredentials(credentials.username, credentials.password).map { ou =>
            ou.fold(Future(Unauthorized("Bad creds")))(u => block(request))
          }
        }.get.flatten
        case _ => Future(Unauthorized("Bad creds"))
      }

    }

    override def parser: BodyParser[AnyContent] = bodyParser

    override def executionContext: ExecutionContext = ec
  }

}
