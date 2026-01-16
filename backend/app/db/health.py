import time
from sqlalchemy import text

from app.db.session import engine
from app.core.logging import get_logger

logger = get_logger(__name__)


class DatabaseHealthCheck:
    def __init__(self, interval: int = 30):
        self.last_check = 0.0
        self.is_healthy = True
        self.interval = interval

    async def check(self) -> bool:
        now = time.time()

        # Skip frequent checks
        if now - self.last_check < self.interval:
            return self.is_healthy

        try:
            async with engine.begin() as conn:
                start = time.time()
                await conn.execute(text("SELECT 1"))
                duration = time.time() - start

                if duration > 1.0:
                    logger.warning(f"Slow DB health check: {duration:.2f}s")

                self.is_healthy = True
                self.last_check = now
                return True

        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            self.is_healthy = False
            return False


db_health = DatabaseHealthCheck()
