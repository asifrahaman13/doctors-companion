# src/application/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.application.web.controllers import user_controller
from fastapi.responses import JSONResponse

app = FastAPI()


origins = [
    "*",
]

# Add middlewares to the origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router, prefix="/users", tags=["users"])


# Health check endpoint
@app.get("/health")
async def health_check():
    return JSONResponse(status_code=200, content={"status": "healthy"})
