from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models import Book, Review
from app.rag.embeddings import EmbeddingModel


class InMemoryIndex:
    """
    TEMP index.
    Replace with vector DB in production.
    """
    store: dict[int, dict] = {}


async def index_book(db: AsyncSession, book_id: int) -> None:
    result = await db.execute(select(Book).where(Book.id == book_id))
    book = result.scalar_one_or_none()

    if not book:
        return

    reviews_result = await db.execute(
        select(Review).where(Review.book_id == book_id)
    )
    reviews = reviews_result.scalars().all()

    content_parts = [
        f"Title: {book.title}",
        f"Author: {book.author.name if book.author else ''}",
        f"Genre: {book.genre.name if book.genre else ''}",
    ]

    if book.summary:
        content_parts.append(f"Summary: {book.summary}")

    review_texts = [r.review_text for r in reviews if r.review_text]
    if review_texts:
        content_parts.append("Reviews: " + " ".join(review_texts[:3]))

    content = " ".join(content_parts)

    embedding = EmbeddingModel.embed(content)

    InMemoryIndex.store[book_id] = {
        "embedding": embedding,
        "content": content,
        "metadata": {
            "book_id": book_id,
            "title": book.title,
        },
    }
