from sentence_transformers import SentenceTransformer
from typing import List


class EmbeddingModel:
    _model = None

    @classmethod
    def get_model(cls) -> SentenceTransformer:
        if cls._model is None:
            cls._model = SentenceTransformer("all-MiniLM-L6-v2")
        return cls._model

    @classmethod
    def embed(cls, text: str) -> List[float]:
        model = cls.get_model()
        return model.encode(text).tolist()
