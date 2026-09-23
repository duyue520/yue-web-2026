from alembic import context
from server.database import engine, Base
from server.models import db_models
from server.routers import guestbook, blog

def run():
    if context.is_offline_mode():
        context.configure(dialect_name='postgresql', target_metadata=Base.metadata, literal_binds=True)
        with context.begin_transaction():
            context.run_migrations()
    else:
        with engine.connect() as connection:
            context.configure(connection=connection, target_metadata=Base.metadata, compare_type=True)
            with context.begin_transaction():
                context.run_migrations()
run()
