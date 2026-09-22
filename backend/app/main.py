from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers.auth import router as auth_router
from app.routers.rfq import router as rfq_router
from app.routers.quotation import router as quotation_router


app = FastAPI(
    title="RFQ Marketplace API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        }
    )


app.include_router(auth_router)
app.include_router(rfq_router)
app.include_router(quotation_router)


@app.get("/")
def root():
    return {
        "message": "RFQ Marketplace API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }