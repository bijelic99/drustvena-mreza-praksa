package services

import javax.inject.Inject
import repository.Repository
import io.jvm.uuid.UUID
import model.StatusLike
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}

class StatusLikeService @Inject()(repository: Repository)(implicit ec: ExecutionContext) {
  def getUsersStatusLikes(userId: _root_.io.jvm.uuid.UUID): Future[Seq[StatusLike]] = {
    statusLikeRepository.getByUserId(userId)
  }

  private val statusLikeRepository = repository.statusLikeRepository

  def getAll() = {
    statusLikeRepository.getAll
  }

  def get(statusId: UUID, userId: UUID) = {
    statusLikeRepository.getByStatusIdAndUserId(statusId, userId)
  }

  def add(statusLike: StatusLike) = {
    statusLikeRepository.add(statusLike)
  }

  def delete(statusId: UUID, userId: UUID) = {
    statusLikeRepository.removeByStatusIdAndUserId(statusId, userId)
  }
}
