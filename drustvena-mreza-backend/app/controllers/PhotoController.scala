package controllers

import java.io.{ByteArrayInputStream, FileInputStream, FileOutputStream, OutputStream}
import java.nio.file.{Files, Paths}

import akka.stream.scaladsl.{FileIO, Source}
import akka.util.ByteString
import io.jvm.uuid.UUID
import javax.inject.Inject
import model.Photo
import play.api.http.{ContentTypes, HttpEntity}
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents, ResponseHeader, Result}
import repository.Repository
import services.PhotoService
import util.UUIDParser

import scala.concurrent.{ExecutionContext, Future}
import scala.io.BufferedSource
import scala.jdk.StreamConverters

class PhotoController @Inject()(controllerComponents: ControllerComponents, photoService: PhotoService)(implicit ec: ExecutionContext)
  extends AbstractController(controllerComponents) {

  def getPhoto(photoId: String) = Action.async { implicit request =>
    UUIDParser.parseUuidFromString(photoId).fold(Future(NotFound("Id invalid"))) { uuid =>
      photoService.get(uuid).map { optional =>
        optional.fold(NotFound("Photo not found")) { photoObj =>
          val byteString = ByteString(photoObj.picture)
          Result(
            header = ResponseHeader(200, Map.empty),
            body = HttpEntity.Strict(byteString, Option(photoObj.mimeType))
          )
        }
      }
    }

  }

  def getPhotoByUserId(userId: String) = Action.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { uuid =>
      photoService.getByUserId(uuid).map{ opt =>
        opt.fold(NotFound("Photo not found")){ photoObj =>
          val byteString = ByteString(photoObj.picture)

          Result(
            header = ResponseHeader(200, Map.empty),
            body = HttpEntity.Strict(byteString, Option(photoObj.mimeType))
          )
        }
      }
    }
  }

  def addPhoto(userId: String) = Action(parse.multipartFormData).async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { uuid =>
      val photo = request.body.file("picture")
      photo.fold(Future(BadRequest("You need to send a picture"))){ pic =>
        val contentType = pic.contentType
        val picBytes = Files.readAllBytes(pic.ref)
        val newPic = Photo(userId = uuid, picture = picBytes, mimeType = contentType.getOrElse(""))
        photoService.add(newPic).map(_ => Ok)
      }
    }
  }


  def deletePhoto(userId: String) = Action.async { implicit request =>
    UUIDParser.parseUuidFromString(userId).fold(Future(NotFound("Id invalid"))) { uuid =>
      photoService.remove(uuid).map(_ => Ok)
    }
  }

}
