# main app the connects all the apps
from fastapi import FastAPI, Depends
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from os import getenv
from account.account import router as account_router
from crud.crud import router as crud_router
from keyclub.keyclub import router as keyclub_router
from utils import require_role

# loads env variables for the whole app
load_dotenv()
app = FastAPI(docs_url=None, redoc_url=None, openapi_url="/openapi.json", root_path="/api", host="0.0.0.0", port=8000)
app.include_router(account_router)
app.include_router(crud_router)
app.include_router(keyclub_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=getenv("CORS_ORIGINS"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=getenv("SESSIONS_SECRET_KEY")
)

@app.get("/")
async def root(_=Depends(require_role("admin"))):
    return get_swagger_ui_html(openapi_url="/api/openapi.json", title="Admin Panel")