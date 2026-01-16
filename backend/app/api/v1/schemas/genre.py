from pydantic import BaseModel
from typing import Optional


class GenreCreate(BaseModel):
    name: str


class GenreUpdate(BaseModel):
    name: Optional[str] = None


class GenreResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
