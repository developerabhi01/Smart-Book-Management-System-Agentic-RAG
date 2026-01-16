from sqlalchemy import Column, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    user_id = Column(Integer)
    review_text = Column(Text)
    rating = Column(Float)

    book = relationship("Book", back_populates="reviews")
