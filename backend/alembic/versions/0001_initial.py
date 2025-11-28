from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE SCHEMA IF NOT EXISTS ref")
    op.execute("CREATE SCHEMA IF NOT EXISTS ops")
    op.execute("CREATE SCHEMA IF NOT EXISTS audit")

    op.create_table(
        "airport",
        sa.Column("airport_iata", sa.Text(), primary_key=True),
        sa.Column("airport_icao", sa.Text()),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("country", sa.Text()),
        sa.Column("timezone", sa.Text()),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        schema="ref",
    )

    op.create_table(
        "base_airport_status",
        sa.Column("base_id", sa.BigInteger(), primary_key=True),
        sa.Column("airport_iata", sa.Text(), sa.ForeignKey("ref.airport.airport_iata"), nullable=False),
        sa.Column("valid_from", sa.DateTime(timezone=True), nullable=False),
        sa.Column("valid_to", sa.DateTime(timezone=True)),
        sa.Column("seasonality", sa.Text(), nullable=False, server_default="PERMANENT"),
        sa.Column("season_pattern", sa.Text()),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("created_by", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_by", sa.Text(), nullable=False),
        schema="ops",
    )

    op.create_table(
        "base_airport_audit",
        sa.Column("audit_id", sa.BigInteger(), primary_key=True),
        sa.Column("base_id", sa.BigInteger()),
        sa.Column("airport_iata", sa.Text(), nullable=False),
        sa.Column("action", sa.Text(), nullable=False),
        sa.Column("change_ts", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("changed_by", sa.Text(), nullable=False),
        sa.Column("old_row", sa.JSON()),
        sa.Column("new_row", sa.JSON()),
        sa.Column("request_ctx", sa.JSON()),
        schema="audit",
    )

    op.create_index(
        "idx_base_airport_status_airport",
        "base_airport_status",
        ["airport_iata", "valid_from", "valid_to"],
        unique=False,
        schema="ops",
    )


def downgrade() -> None:
    op.drop_index("idx_base_airport_status_airport", table_name="base_airport_status", schema="ops")
    op.drop_table("base_airport_audit", schema="audit")
    op.drop_table("base_airport_status", schema="ops")
    op.drop_table("airport", schema="ref")
