name := """drustvena-mreza-backend"""
organization := "praksa.novalite"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.2"

libraryDependencies ++= Seq(
  guice,
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test,
  "io.jvm.uuid" %% "scala-uuid" % "0.3.1",
  "com.typesafe.play" %% "play-slick" % "5.0.0",
  "com.typesafe.play" %% "play-slick-evolutions" % "5.0.0",
  "com.typesafe.slick" %% "slick" % "3.3.2",
  "mysql" % "mysql-connector-java" % "8.0.20",
  "com.pauldijou" %% "jwt-play" % "4.3.0",
  "com.pauldijou" %% "jwt-core" % "4.3.0",
  "com.auth0" % "jwks-rsa" % "0.12.0"
)

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "praksa.novalite.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "praksa.novalite.binders._"
