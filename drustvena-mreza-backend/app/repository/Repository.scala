package repository

import java.sql.Timestamp
import java.time.{LocalDateTime, ZoneOffset}

import io.jvm.uuid._
import javax.inject.Inject
import model.{FriendRequest, Friendship, Photo, Status, StatusLike, User}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.JsResult.Exception
import slick.jdbc.JdbcProfile
import slick.jdbc.meta.MTable
import util.UserToStringConverter

import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.language.postfixOps
import scala.concurrent.ExecutionContext
import scala.reflect.internal.util.TableDef.Column

class Repository @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {

  private val dbConfig = dbConfigProvider.get[JdbcProfile]


  import dbConfig._
  import profile.api._

  /*-
    implicit private val uuidMapper = MappedColumnType.base[UUID, String](
      {uuid: UUID => uuid.toString},
      {str: String => UUID(str.toCharArray)}
    )*/

  /*implicit private val ldtMapper = MappedColumnType.base[LocalDateTime, Timestamp](
    ldt => Timestamp.from(ldt.toInstant(ZoneOffset.UTC))
    _.toLocalDateTime
  )*/

  private class UserTableDef(tag: Tag) extends Table[User](tag, "user") {

    import io.jvm.uuid._

    def id = column[UUID]("id", O.PrimaryKey, O.Unique)

    def username = column[String]("username", O.Unique)

    def password = column[String]("password")

    def firstName = column[Option[String]]("first_name")

    def lastName = column[Option[String]]("last_name")

    def email = column[String]("email", O.Unique)

    def registeredAt = column[LocalDateTime]("registered_at")

    def * = (id.?, username, password, firstName, lastName, email, registeredAt) <> ((User.apply _).tupled, User.unapply)
  }


  private class StatusTableDef(tag: Tag) extends Table[Status](tag, "status") {
    def id = column[UUID]("id", O.PrimaryKey, O.Unique)

    def user_id = column[UUID]("user_id")

    def created_at = column[LocalDateTime]("created_at")

    def contents = column[String]("contents")

    def user_fk = foreignKey("user_fk", user_id, users)(_.id)

    def * = (id.?, user_id, created_at, contents) <> ((Status.apply _).tupled, Status.unapply)
  }


  private class StatusLikeTableDef(tag: Tag) extends Table[StatusLike](tag, "status_like") {


    def status_id = column[UUID]("status_id")

    def user_id = column[UUID]("user_id")

    def pk = primaryKey("pk_status_like", (status_id, user_id))

    def user_fk = foreignKey("user_fk", user_id, users)(_.id)

    def status_fk = foreignKey("status_fk", status_id, statuses)(_.id)

    def * = (status_id, user_id) <> ((StatusLike.apply _).tupled, StatusLike.unapply)
  }


  private class PhotoTableDef(tag: Tag) extends Table[Photo](tag, "photo") {


    def id = column[UUID]("id", O.Unique, O.PrimaryKey)

    def user_id = column[UUID]("user_id")

    def picture = column[Array[Byte]]("picture")

    def mime_type = column[String]("mime_type")

    def user_fk = foreignKey("user_fk", user_id, users)(_.id)

    def * = (id.?, user_id, picture, mime_type) <> ((Photo.apply _).tupled, Photo.unapply)
  }


  private class FriendshipTableDef(tag: Tag) extends Table[Friendship](tag, "friendship") {
    def first_user = column[UUID]("first_user")

    def second_user = column[UUID]("second_user")

    def created_at = column[LocalDateTime]("created_at")

    def pk = primaryKey("friendship_pk", (first_user, second_user))

    def first_user_fk = foreignKey("first_user_fk", first_user, users)(_.id)

    def second_user_fk = foreignKey("second_user_fk", second_user, users)(_.id)

    override def * = (first_user, second_user, created_at) <> ((Friendship.apply _).tupled, Friendship.unapply)
  }


  private class FriendRequestTableDef(tag: Tag) extends Table[FriendRequest](tag, "friend_request") {
    def sender = column[UUID]("sender")

    def recipient = column[UUID]("recipient")

    def sent_at = column[LocalDateTime]("created_at")

    def pk = primaryKey("friendship_pk", (sender, recipient))

    def sender_fk = foreignKey("sender_fk", sender, users)(_.id)

    def recipient_fk = foreignKey("recipient_fk", recipient, users)(_.id)

    override def * = (sender, recipient, sent_at) <> ((FriendRequest.apply _).tupled, FriendRequest.unapply)
  }

  private val users = TableQuery[UserTableDef]
  private val statuses = TableQuery[StatusTableDef]
  private val statusLikes = TableQuery[StatusLikeTableDef]
  private val photos = TableQuery[PhotoTableDef]
  private val friendships = TableQuery[FriendshipTableDef]
  private val friendRequests = TableQuery[FriendRequestTableDef]

  class UserRepository extends CrudTrait[User, UUID] {

    override def getAll: Future[Seq[User]] = db.run {
      users.result
    }


    def findUser(searchString: String) = {
      getAll.map { users =>
        users.filter {
          user =>
            UserToStringConverter.convertToString(user).contains(searchString)
        }.toList
      }
    }

    override def getById(id: _root_.io.jvm.uuid.UUID): Future[Option[User]] = db.run {
      users.filter {
        _.id === id
      }.result.headOption
    }

    override def add(item: User): Future[Option[User]] = {

      val newItem = item.copy(id = Option(UUID.random))
      db.run {
        users += newItem
      }.map {
        case 0 => Option.empty[User]
        case _ => Option(newItem)
      }

    }

    override def update(item: User): Future[Int] = db.run {
      users.findBy(_.id).applied(item.id.get).update(item)
    }

    override def removeById(id: _root_.io.jvm.uuid.UUID): Future[Int] = db.run {

      users.findBy(_.id).applied(id).delete

    }

    override def removeAll: Future[Int] = db.run {
      users.delete
    }

    def isEmailUnique(email: String) = db.run {
      users.findBy(_.email).applied(email).result
    }.map(
      _.size match {
        case 0 => true
        case _ => false
      })

    def isUsernameUnique(username: String) = db.run {
      users.findBy(_.username).applied(username).result
    }.map(
      _.size match {
        case 0 => true
        case _ => false
      })

    def findUserByCredentials(username: String, password: String): Future[Option[User]] = db.run {
      users.filter(x => x.username === username && x.password === password).result.headOption
    }

    def getUsers(ids: Seq[UUID]): Future[Seq[User]] = db.run {
      users.filter { user =>
        ids.map(user.id === _).reduceLeftOption(_ || _).getOrElse(false: Rep[Boolean])
      }.result
    }

  }

  class StatusRepository extends CrudTrait[Status, UUID] {
    def getByUserId(userId: _root_.io.jvm.uuid.UUID): Future[Seq[Status]] = db.run {
      statuses.filter(_.user_id === userId).result
    }

    override def getAll: Future[Seq[Status]] = db.run {
      statuses.result
    }

    override def getById(id: _root_.io.jvm.uuid.UUID): Future[Option[Status]] = db.run {
      statuses.findBy(_.id).applied(id).result.headOption
    }

    override def add(item: Status): Future[Option[Status]] = {

      val newItem = item.copy(id = Option(UUID.random))
      db.run {
        statuses += newItem
      }.map {
        case 0 => Option.empty[Status]
        case _ => Option(newItem)
      }
    }


    override def update(item: Status): Future[Int] = db.run {
      statuses.findBy(_.id).applied(item.id.get).update(item)
    }

    override def removeById(id: _root_.io.jvm.uuid.UUID): Future[Int] = db.run {
      statuses.findBy(_.id).applied(id).delete
    }

    override def removeAll: Future[Int] = db.run {
      statuses.delete
    }

    def getStatuses(userIds: Seq[UUID]): Future[Seq[Status]] = db.run {
      statuses.filter { x =>
        userIds.map(x.user_id === _).reduceLeftOption(_ || _).getOrElse(false: Rep[Boolean])
      }.result
    }

  }

  class PhotoRepository extends CrudTrait[Photo, UUID] {
    override def getAll: Future[Seq[Photo]] = db.run {
      photos.result
    }

    override def getById(id: _root_.io.jvm.uuid.UUID): Future[Option[Photo]] = db.run {
      photos.findBy(_.id).applied(id).result.headOption
    }

    def getByIdUserId(id: _root_.io.jvm.uuid.UUID): Future[Option[Photo]] = db.run {
      photos.findBy(_.user_id).applied(id).result.headOption
    }

    override def add(item: Photo): Future[Option[Photo]] = {

      val newItem = item.copy(id = Option(UUID.random))
      db.run {
        photos += newItem
      }.map {
        case 0 => Option.empty[Photo]
        case _ => Option(newItem)
      }
    }


    override def update(item: Photo): Future[Int] = db.run {
      photos.findBy(_.id).applied(item.id.get).update(item)
    }

    override def removeById(id: _root_.io.jvm.uuid.UUID): Future[Int] = db.run {
      photos.findBy(_.id).applied(id).delete
    }

    override def removeAll: Future[Int] = db.run {
      photos.delete
    }
  }

  class StatusLikeRepository extends CrudTrait[StatusLike, UUID] {
    def getByUserId(userId: _root_.io.jvm.uuid.UUID): Future[Seq[StatusLike]] = db.run {
      statusLikes.filter(_.user_id === userId).result
    }

    override def getAll: Future[Seq[StatusLike]] = db.run {
      statusLikes.result
    }

    override def getById(id: _root_.io.jvm.uuid.UUID): Future[Option[StatusLike]] = {
      Future {
        throw new NotImplementedError("Not supported")
      }
    }

    def getByStatusIdAndUserId(statusId: _root_.io.jvm.uuid.UUID, userId: _root_.io.jvm.uuid.UUID): Future[Option[StatusLike]] = db.run {
      statusLikes.filter(x => x.status_id === statusId && x.user_id === userId).result.headOption
    }

    override def add(item: StatusLike): Future[Option[StatusLike]] = {

      val newItem = item.copy()
      db.run {
        statusLikes += newItem
      }.map {
        case 0 => Option.empty[StatusLike]
        case _ => Option(newItem)
      }
    }

    override def update(item: StatusLike): Future[Int] = {
      throw new NotImplementedError("Not supported")
    }

    override def removeById(id: UUID): Future[Int] = Future {
      throw new NotImplementedError("Not supported")
    }

    def removeByStatusIdAndUserId(statusId: UUID, userId: UUID) = db.run {
      statusLikes.filter(x =>
        x.status_id === statusId && x.user_id === userId
      ).delete
    }

    override def removeAll: Future[Int] = db.run {
      statusLikes.delete
    }
  }

  class FriendRequestRepository extends CrudTrait[FriendRequest, UUID] {
    override def getAll: Future[Seq[FriendRequest]] = db.run {
      friendRequests.result
    }

    override def getById(id: _root_.io.jvm.uuid.UUID): Future[Option[FriendRequest]] = {
      Future {
        throw new NotImplementedError("Not supported")
      }
    }

    def getByUserIds(senderId: _root_.io.jvm.uuid.UUID, recipientId: _root_.io.jvm.uuid.UUID): Future[Option[FriendRequest]] = db.run {
      friendRequests.filter(x => x.sender === senderId && x.recipient === recipientId).result.headOption
    }

    override def add(item: FriendRequest): Future[Option[FriendRequest]] = {

      val newItem = item.copy()
      db.run {
        friendRequests += newItem
      }.map {
        case 0 => Option.empty[FriendRequest]
        case _ => Option(newItem)
      }

    }

    override def update(item: FriendRequest): Future[Int] = Future {
      throw new NotImplementedError("Not supported")
    }

    override def removeById(id: _root_.io.jvm.uuid.UUID): Future[Int] = Future {
      throw new NotImplementedError("Not supported")
    }

    def removeByUserIds(senderId: _root_.io.jvm.uuid.UUID, recipientId: _root_.io.jvm.uuid.UUID): Future[Int] = db.run {
      friendRequests.filter(x => x.sender === senderId && x.recipient === recipientId).delete
    }

    override def removeAll: Future[Int] = db.run {
      friendRequests.delete
    }

    def getByRecipientId(recipient: UUID): Future[Seq[FriendRequest]] = db.run {
      friendRequests.filter(_.recipient === recipient).result
    }
  }

  class FriendshipRepository extends CrudTrait[Friendship, UUID] {
    override def getAll: Future[Seq[Friendship]] = db.run {
      friendships.result
    }

    override def getById(id: _root_.io.jvm.uuid.UUID): Future[Option[Friendship]] = Future {
      throw new NotImplementedError("Not supported")
    }

    def getByUserIds(firstUserId: _root_.io.jvm.uuid.UUID, secondUserId: _root_.io.jvm.uuid.UUID): Future[Option[Friendship]] = db.run {
      friendships
        .filter(x => (x.first_user === firstUserId && x.second_user === secondUserId)
          || (x.first_user === secondUserId && x.second_user === firstUserId))
        .result.headOption
    }

    override def add(item: Friendship): Future[Option[Friendship]] = {

      val newItem = item.copy()
      db.run {
        friendships += newItem
      }.map {
        case 0 => Option.empty[Friendship]
        case _ => Option(newItem)
      }

    }


    override def update(item: Friendship): Future[Int] = Future {
      throw new NotImplementedError("Not supported")
    }

    override def removeById(id: _root_.io.jvm.uuid.UUID): Future[Int] = Future {
      throw new NotImplementedError("Not supported")
    }

    def removeByUserIds(firstUserId: _root_.io.jvm.uuid.UUID, secondUserId: _root_.io.jvm.uuid.UUID): Future[Int] = db.run {
      friendships
        .filter(x => (x.first_user === firstUserId && x.second_user === secondUserId)
          || (x.first_user === secondUserId && x.second_user === firstUserId))
        .delete
    }

    override def removeAll: Future[Int] = db.run {
      friendships.delete
    }

    def getByUserId(userId: UUID): Future[Seq[Friendship]] = db.run {
      friendships.filter(x => x.first_user === userId || x.second_user === userId).result
    }

    def getUsersFriendships(userId: UUID): Future[Seq[Friendship]] = db.run {
      friendships.filter(x => x.first_user === userId || x.second_user === userId).result
    }
  }

  val userRepository = new UserRepository()
  val statusRepository = new StatusRepository()
  val photoRepository = new PhotoRepository()
  val statusLikeRepository = new StatusLikeRepository()
  val friendRequestRepository = new FriendRequestRepository()
  val friendshipRepository = new FriendshipRepository()


  private val schemas = users.schema ++ statuses.schema ++ statusLikes.schema ++ photos.schema ++ friendships.schema ++ friendRequests.schema


}
