from pydantic import BaseModel
from typing import Optional


class AuthorCreate(BaseModel):
    name: str


class AuthorUpdate(BaseModel):
    name: Optional[str] = None


class AuthorResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
