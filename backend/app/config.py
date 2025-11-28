from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = Field(
        default="postgresql+psycopg2://postgres:postgres@localhost:5432/base_management",
        description="URL de conexión a PostgreSQL",
    )
    enable_auth: bool = Field(
        default=False,
        description="Permite activar la validación Azure AD; desactivado en la v1 básica",
    )
    azure_tenant_id: str | None = None
    azure_client_id: str | None = None
    azure_audience: str | None = None

    class Config:
        env_file = ".env"
        env_prefix = "BASE_APP_"


def get_settings() -> Settings:
    return Settings()
