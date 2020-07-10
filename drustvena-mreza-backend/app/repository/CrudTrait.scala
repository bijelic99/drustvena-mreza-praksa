package repository

import scala.concurrent.Future

trait CrudTrait[ItemType, IdType] {
  def getAll: Future[Seq[ItemType]]
  def getById(id: IdType): Future[Option[ItemType]]
  def add(item: ItemType): Future[Option[ItemType]]
  def update(item: ItemType): Future[Int]
  def removeById(id: IdType): Future[Int]
  def removeAll: Future[Int]

}
