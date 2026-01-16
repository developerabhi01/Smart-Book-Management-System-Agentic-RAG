from pydantic import BaseModel


class ReviewCreate(BaseModel):
    user_id: int
    review_text: str
    rating: float


class ReviewResponse(ReviewCreate):
    id: int
    book_id: int

    class Config:
        from_attributes = True
