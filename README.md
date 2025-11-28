# Backoffice Bases Aerolínea (v1 básica)

Esta versión inicial incluye el esqueleto del backend FastAPI con modelos SQLAlchemy, migración inicial Alembic y tests básicos de validación de solapamientos.

## Estructura
- `backend/app`: código FastAPI (configuración, modelos, rutas y servicios).
- `backend/alembic`: configuración y migración inicial de bases/auditoría.
- `backend/tests`: tests de API con base de datos SQLite en memoria.

## Configuración rápida
1. Crear y activar un entorno virtual de Python 3.11+.
2. Instalar dependencias: `pip install -r backend/requirements.txt`.
3. Variables de entorno (opcional, archivo `.env`):
   - `BASE_APP_DATABASE_URL` (por defecto: `postgresql+psycopg2://postgres:postgres@localhost:5432/base_management`).
   - `BASE_APP_USE_SCHEMAS` (por defecto `True`; ponlo a `False` para usar SQLite en memoria o sin esquemas anidados).
   - `BASE_APP_ENABLE_AUTH` (por defecto `False`, mantiene Azure AD deshabilitado en esta versión).
   - `BASE_APP_AZURE_TENANT_ID`, `BASE_APP_AZURE_CLIENT_ID`, `BASE_APP_AZURE_AUDIENCE` (preparados para futuras validaciones Azure AD).

## Ejecutar backend
```bash
uvicorn app.main:app --reload --app-dir backend
```
El endpoint `/health` devuelve un `{"status": "ok"}` para comprobación rápida.

## Migraciones de base de datos
Configura la URL en `backend/alembic.ini` (clave `sqlalchemy.url`) o usa la variable de entorno `BASE_APP_DATABASE_URL` y ejecuta:
```bash
cd backend
alembic upgrade head
```

## Tests
Los tests se ejecutan contra SQLite en memoria y validan la creación y el control de solapamientos:
```bash
cd backend
pytest
```

## Próximos pasos sugeridos
- Añadir autenticación Azure AD (MSAL en frontend, validación PyJWT en backend) activable con `BASE_APP_ENABLE_AUTH=true`.
- Completar endpoints de auditoría y borrado lógico.
- Crear frontend Angular 13 siguiendo el Volotea Design System y consumir estos endpoints.
