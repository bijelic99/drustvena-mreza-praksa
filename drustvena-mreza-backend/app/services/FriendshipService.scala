package services

import javax.inject.Inject
import repository.Repository
import io.jvm.uuid.UUID
import model.Friendship

import scala.concurrent.ExecutionContext

class FriendshipService @Inject()(repository: Repository)(implicit ec: ExecutionContext) {

  private val friendshipRepository = repository.friendshipRepository

  def getAll() = {
    friendshipRepository.getAll
  }

  def get(firstUserId: UUID, secondUserId: UUID) = {
    friendshipRepository.getByUserIds(firstUserId, secondUserId)
  }

  def add(frienship: Friendship) = {
    friendshipRepository.add(frienship)
  }

  def deleteFriendship(firstUserId: UUID, secondUserId: UUID) = {
    friendshipRepository.removeByUserIds(firstUserId, secondUserId)
  }

  def getUsersFriendships(userId: UUID) = {
    friendshipRepository.getByUserId(userId)
  }

  def getUsersFriendshipsAsUsers(userId: UUID) = {
    friendshipRepository.getByUserId(userId).map { userFriendships =>
      val ids = userFriendships
        .map(fp => List(fp.firstUser, fp.secondUser))
        .flatten
        .distinct
        .filter(id => !id.equals(userId))

      repository.userRepository.getUsers(ids)
    }
  }.flatten
}
