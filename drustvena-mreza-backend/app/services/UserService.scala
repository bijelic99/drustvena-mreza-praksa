package services

import javax.inject.Inject
import play.api.libs.json.Json
import repository.Repository
import io.jvm.uuid._
import model.User
import util.StringToMD5HashConverter
import util.StringToMD5HashConverter.hashString

import scala.concurrent.{ExecutionContext, Future}

class UserService @Inject()(repository: Repository)(implicit ec: ExecutionContext) {
  private val userRepository = repository.userRepository

  def getAllUsers() = {
    userRepository.getAll
  }

  def getById(id: UUID) = {
    userRepository.getById(id)
  }

  def add(user: User) = {
    userRepository.add(user.copy(password = hashString(user.password)))
  }


  def update(user: User) = {
    userRepository.update(user)
  }

  def delete(userId: UUID) = {
    userRepository.removeById(userId)
  }

  def isEmailUnique(email: String) = {
    userRepository.isEmailUnique(email)
  }

  def changePassword(userId: UUID, currentPassword: String, newPassword: String) = {
    userRepository.getById(userId).map { optUser =>
      optUser.fold(Future(Option.empty[User])) { user =>
        val updatedUser = user.copy(password = StringToMD5HashConverter.hashString(newPassword))
        userRepository.update(updatedUser).map { _ =>
          Option(updatedUser)
        }
      }
    }.flatten
  }

  def isUsernameUnique(username: String) = {
    userRepository.isUsernameUnique(username)
  }

  def login(username: String, password: String) = {
    userRepository.findUserByCredentials(username, StringToMD5HashConverter.hashString(password))
  }

  def getUsers(searchString: String) = {
    userRepository.findUser(searchString)
  }

}
