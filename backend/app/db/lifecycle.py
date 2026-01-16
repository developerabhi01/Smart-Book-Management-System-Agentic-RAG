from sqlalchemy import event

from app.db.session import engine
from app.db.base import Base
from app.core.logging import get_logger

logger = get_logger(__name__)


async def init_database() -> None:
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


async def close_database() -> None:
    try:
        await engine.dispose()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error closing database: {e}")


# ---- Connection monitoring ----

@event.listens_for(engine.sync_engine, "connect")
def on_connect(dbapi_connection, connection_record):
    logger.debug("New database connection established")


@event.listens_for(engine.sync_engine, "checkout")
def on_checkout(dbapi_connection, connection_record, connection_proxy):
    logger.debug("Database connection checked out")


@event.listens_for(engine.sync_engine, "checkin")
def on_checkin(dbapi_connection, connection_record):
    logger.debug("Database connection returned to pool")
