package services

import dto.NewFriendRequest
import javax.inject.Inject
import repository.Repository
import io.jvm.uuid.UUID
import model.{FriendRequest, Friendship}
import play.api.mvc.Result

import scala.concurrent.{ExecutionContext, Future}

class FriendRequestService @Inject()(repository: Repository)(implicit ec: ExecutionContext) {

  def acceptFriendRequest(friendRequest: FriendRequest) = {
    friendRequestRepository.removeByUserIds(friendRequest.sender, friendRequest.recipient).map { _ =>
      repository.friendshipRepository
        .add(Friendship(firstUser = friendRequest.sender, secondUser = friendRequest.recipient))
    }.flatten

  }

  private val friendRequestRepository = repository.friendRequestRepository

  def getUsersFriendRequests(userId: _root_.io.jvm.uuid.UUID): Future[Seq[FriendRequest]] = {
    friendRequestRepository.getByRecipientId(userId)
  }

  def getAll() = {
    friendRequestRepository.getAll
  }

  def get(senderId: UUID, recipientId: UUID) = {
    friendRequestRepository.getByUserIds(senderId, recipientId)
  }

  def add(friendRequest: FriendRequest) = {
    friendRequestRepository.add(friendRequest)
  }

  def remove(sender: UUID, recipient: UUID) = {
    friendRequestRepository.removeByUserIds(sender, recipient)
  }

}
