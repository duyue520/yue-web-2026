"""Initial schema for a NEW PostgreSQL database only. No private records included."""
from alembic import op
import sqlalchemy as sa
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def ident():
    return sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True)
def created():
    return sa.Column('created_at', sa.DateTime(), nullable=True)
def uid():
    return sa.Column('user_id',sa.Integer(),sa.ForeignKey('users.id'),nullable=False)
def upgrade():
    op.create_table('users',ident(),sa.Column('username',sa.String(50),nullable=False),sa.Column('email',sa.String(100)),sa.Column('hashed_password',sa.String(200),nullable=False),sa.Column('avatar_base64',sa.Text()),sa.Column('is_active',sa.Boolean()),created())
    op.create_index('ix_users_username','users',['username'],unique=True)
    op.create_table('diagnosis_records',ident(),uid(),sa.Column('image_base64',sa.Text()),sa.Column('top1_disease',sa.String(100),nullable=False),sa.Column('top1_confidence',sa.Float(),nullable=False),sa.Column('top2_disease',sa.String(100)),sa.Column('top2_confidence',sa.Float()),sa.Column('top3_disease',sa.String(100)),sa.Column('top3_confidence',sa.Float()),sa.Column('is_healthy',sa.Boolean()),sa.Column('severity',sa.String(20)),sa.Column('severity_percent',sa.Float()),created())
    op.create_table('feedbacks',ident(),uid(),sa.Column('category',sa.String(30),nullable=False),sa.Column('title',sa.String(200),nullable=False),sa.Column('content',sa.Text(),nullable=False),sa.Column('reply',sa.Text()),sa.Column('replied_at',sa.DateTime()),created())
    op.create_table('corrected_labels',ident(),uid(),sa.Column('diagnosis_id',sa.Integer(),sa.ForeignKey('diagnosis_records.id')),sa.Column('original_prediction',sa.String(100),nullable=False),sa.Column('corrected_label',sa.String(100),nullable=False),sa.Column('image_base64',sa.Text()),created())
    op.create_table('guestbook_messages',ident(),sa.Column('user_id',sa.Integer()),sa.Column('owner_name',sa.String(50)),sa.Column('nickname',sa.String(50),nullable=False),sa.Column('content',sa.Text(),nullable=False),sa.Column('deleted',sa.Boolean()),created())
    op.create_table('blog_categories',ident(),sa.Column('name',sa.String(50),nullable=False,unique=True))
    op.create_table('blog_articles',ident(),sa.Column('title',sa.String(200),nullable=False),sa.Column('content',sa.Text(),nullable=False),sa.Column('summary',sa.String(500)),sa.Column('cover_url',sa.String(500)),sa.Column('category_id',sa.Integer(),sa.ForeignKey('blog_categories.id')),uid(),sa.Column('views',sa.Integer()),created())
    op.create_table('blog_comments',ident(),sa.Column('article_id',sa.Integer(),sa.ForeignKey('blog_articles.id'),nullable=False),sa.Column('user_id',sa.Integer(),sa.ForeignKey('users.id'),nullable=True),sa.Column('content',sa.Text(),nullable=False),created())

def downgrade():
    raise RuntimeError('Destructive downgrade disabled: restore a reviewed backup instead')
