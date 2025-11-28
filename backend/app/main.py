from fastapi import FastAPI
from .routers import router

app = FastAPI(title="Base Airports Backoffice API")
app.include_router(router)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}
