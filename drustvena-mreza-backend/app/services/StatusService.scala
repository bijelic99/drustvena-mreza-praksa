package services

import dto.ExpandedStatus
import javax.inject.Inject
import repository.Repository
import io.jvm.uuid.UUID
import model.Status
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}

class StatusService @Inject()(repository: Repository)(implicit ec: ExecutionContext) {
  def getUsersStatuses(userId: _root_.io.jvm.uuid.UUID): Future[Seq[Status]] = {
    statusRepository.getByUserId(userId)
  }


  def getUsersFriendsStatuses(userId: _root_.io.jvm.uuid.UUID): Future[Seq[ExpandedStatus]] = {
    repository.friendshipRepository.getUsersFriendships(userId).map { friendships =>
      val friendsIds = friendships
        .map(fsp => List(fsp.firstUser, fsp.secondUser))
        .flatten.distinct
        .filter(!userId.equals(_))
      statusRepository.getStatuses(friendsIds).map { statuses =>
        val userIds = statuses.map(_.userId)
        repository.userRepository.getUsers(userIds).map { users =>
          statuses.map { status =>
            ExpandedStatus(status.id, status.userId,
              status.createdAt, status.contents, users.find(x=>x.id.fold(false)(_.equals(status.userId))))
          }
        }
      }
    }.flatten.flatten
  }

  private val statusRepository = repository.statusRepository

  def getAll() = {
    statusRepository.getAll
  }

  def get(statusId: UUID) = {
    statusRepository.getById(statusId)
  }

  def add(status: Status) = {
    statusRepository.add(status)
  }

  def update(status: Status) = {
    statusRepository.update(status)
  }

  def delete(statusId: UUID) = {
    statusRepository.removeById(statusId)
  }
}
