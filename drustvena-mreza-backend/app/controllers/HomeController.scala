package controllers


import java.time.LocalDateTime

import javax.inject._
import model.User
import play.api._
import play.api.libs.json.Json
import play.api.mvc._
import repository.Repository
import io.jvm.uuid._

import scala.concurrent.ExecutionContext


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
import repository.Repository

@Singleton
class HomeController @Inject()(controllerComponents: ControllerComponents, userService: Repository)(implicit ec: ExecutionContext) extends AbstractController(controllerComponents) {

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index() = Action {
    implicit request: Request[AnyContent] => {
      Ok
    }

  }
}
