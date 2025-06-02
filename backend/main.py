from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, register

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    users.router,
    prefix="/api/users",
    tags=["users"],
)

app.include_router(
    register.router,
    prefix="/api/register",
    tags=["register"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}