package services

import javax.inject.Inject
import repository.Repository
import io.jvm.uuid.UUID
import model.Photo

import scala.concurrent.ExecutionContext

class PhotoService @Inject()(repository: Repository)(implicit ec: ExecutionContext) {
  private val photoRepository = repository.photoRepository

  def get(id: UUID) = {
    photoRepository.getById(id)
  }

  def getByUserId(userId: UUID) = {
    photoRepository.getByIdUserId(userId)
  }

  def add(photo: Photo) = {
    photoRepository.add(photo)
  }

  def remove(userId: UUID) = {
    photoRepository.removeById(userId)
  }
}
