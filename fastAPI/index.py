from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from demo_auth.views import router as demo_auth_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex='http://localhost:5173',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin",
                   "Authorization", "User_id", "Cookie"],
)

app.include_router(demo_auth_router)
