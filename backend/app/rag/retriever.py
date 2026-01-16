import numpy as np
from typing import List, Dict, Any
from sklearn.metrics.pairwise import cosine_similarity

from app.rag.embeddings import EmbeddingModel
from app.rag.indexer import InMemoryIndex


def search_similar_books(
    query: str,
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    if not InMemoryIndex.store:
        return []

    query_embedding = np.array(
        EmbeddingModel.embed(query)
    ).reshape(1, -1)

    results = []

    for book_id, data in InMemoryIndex.store.items():
        book_embedding = np.array(data["embedding"]).reshape(1, -1)
        score = cosine_similarity(query_embedding, book_embedding)[0][0]

        results.append(
            {
                "book_id": book_id,
                "similarity_score": float(score),
                "metadata": data["metadata"],
                "content": data["content"],
            }
        )

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:top_k]
