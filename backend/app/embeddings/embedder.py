# backend/app/embeddings/embedder.py
# Purpose: Handle vector embedding generation and similarity search.
# Uses local models (No API calls) for zero-latency scoring.

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import List
from app.core.config import settings

class EmbeddingService:
    def __init__(self):
        # Load model once
        print(f"Loading Embedding Model: {settings.EMBEDDING_MODEL}...")
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.dimension = self.model.get_sentence_embedding_dimension()

    def embed_text(self, text: str) -> np.ndarray:
        """
        Generate embedding for a single string.
        """
        if not text:
            return np.zeros(self.dimension, dtype='float32')
        return self.model.encode([text])[0]

    def embed_batch(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for a list of strings.
        """
        if not texts:
            return np.empty((0, self.dimension), dtype='float32')
        return self.model.encode(texts)

    def compute_similarity_score(self, source_text: str, target_text: str) -> float:
        """
        Compute cosine similarity between two text blocks.
        Returns a float between 0.0 and 1.0 (normalized).
        """
        if not source_text or not target_text:
            return 0.0

        emb1 = self.embed_text(source_text).reshape(1, -1)
        emb2 = self.embed_text(target_text).reshape(1, -1)
        
        # FAISS implementation for similarity
        index = faiss.IndexFlatIP(self.dimension)
        faiss.normalize_L2(emb1)
        faiss.normalize_L2(emb2)
        
        index.add(emb1)
        D, I = index.search(emb2, 1) # search emb2 in index of emb1
        
        return float(D[0][0])

# Global instance
embedding_service = EmbeddingService()
