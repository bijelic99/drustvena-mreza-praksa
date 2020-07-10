package util

import com.typesafe.config.ConfigFactory
import java.time.Clock

import dto.{NewUser, UserCredentials}
import model.User
import pdi.jwt.{Jwt, JwtAlgorithm, JwtClaim}
import play.api.libs.json
import play.api.libs.json.Json

class JwtUtility {
  private val secretKey = ConfigFactory.load().getString("utill.jwt.secret_key")

  def createToken(user: User) = {
    implicit val clock: Clock = Clock.systemUTC
    val jsonUserCreds = Json.toJson(UserCredentials(username = user.username, password = user.password)).toString()
    Jwt.encode(JwtClaim(jsonUserCreds).issuedNow.expiresIn(60*60*24*31),
      secretKey, JwtAlgorithm.HS256)
  }

  def isTokenValid(token: String) = {
    Jwt.isValid(token, secretKey, Seq(JwtAlgorithm.HS256))
  }

  def decodePayload(token: String) = {
    Jwt.decode(token, secretKey, Seq(JwtAlgorithm.HS256)).map( claim =>
     Json.parse(claim.content).asOpt[UserCredentials].fold(Option.empty[UserCredentials]){ uc=>
        Option(uc)
     }
    ).recover{
      case _=>Option.empty[UserCredentials]
    }
  }

}
