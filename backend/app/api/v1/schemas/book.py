from pydantic import BaseModel
from typing import Optional


# -------------------------
# Base
# -------------------------
class BookBase(BaseModel):
    title: str
    author_id: int
    genre_id: int
    year_published: int


# -------------------------
# Create
# -------------------------
class BookCreate(BookBase):
    pass


# -------------------------
# Update
# -------------------------
class BookUpdate(BaseModel):
    title: Optional[str] = None
    author_id: Optional[int] = None
    genre_id: Optional[int] = None
    year_published: Optional[int] = None
    summary: Optional[str] = None


# -------------------------
# Response
# -------------------------
class BookResponse(BaseModel):
    id: int
    title: str
    author_id: int
    genre_id: int
    year_published: int
    summary: Optional[str] = None
    author_name: Optional[str] = None
    genre_name: Optional[str] = None

    class Config:
        from_attributes = True
