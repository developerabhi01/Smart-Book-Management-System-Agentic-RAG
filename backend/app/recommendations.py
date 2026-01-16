from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db.models import Book
from sqlalchemy.future import select

async def recommend_books(db, genre: str):
    result = await db.execute(
        select(Book).where(Book.genre == genre)
    )
    return result.scalars().all()
