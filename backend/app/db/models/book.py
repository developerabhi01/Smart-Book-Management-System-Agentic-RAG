from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("authors.id"), nullable=False)
    genre_id = Column(Integer, ForeignKey("genres.id"), nullable=False)
    year_published = Column(Integer)
    summary = Column(Text)

    author = relationship("Author", back_populates="books")
    genre = relationship("Genre", back_populates="books")
    reviews = relationship("Review", back_populates="book")
