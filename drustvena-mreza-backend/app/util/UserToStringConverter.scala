package util

import model.User

object UserToStringConverter {
  def convertToString(user: User) = {
    val lst =  List(
      user.username,
      user.email,
      user.firstName.fold("")(x=>x),
      user.lastName.fold("")(x=>x)
    )
    lst.mkString(" ")
  }
}
