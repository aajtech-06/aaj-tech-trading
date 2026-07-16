from fastapi import APIRouter, HTTPException, BackgroundTasks, Response
from database import get_db
from models import SignupRequest, UserResponse
from utils.email import send_welcome_email
from utils.auth import verify_password, create_access_token
import os
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional

router = APIRouter()
db = get_db()

class LoginRequest(BaseModel):
    email: str
    password: str
    remember: Optional[bool] = False

@router.post("/signup", response_model=dict)
async def signup(request: SignupRequest, background_tasks: BackgroundTasks):
    # Check if user already exists
    existing_user = db.users.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    
    # Create new user in MongoDB
    user_dict = {
        "fullName": request.fullName,
        "email": request.email,
        "role": "user",
        "isActive": False, # User is inactive until password is set
        "createdAt": datetime.now()
    }
    
    # In a real app, you'd generate a secure token for password setting
    # For this demonstration, we'll use a mock reset link
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    reset_link = f"{frontend_url}/set-password?email={request.email}&token=secure-token-123"
    
    result = db.users.insert_one(user_dict)
    
    # Send welcome email in background
    background_tasks.add_task(send_welcome_email, request.email, request.fullName, reset_link)
    
    return {"message": "Signup successful. Please check your email to set your password.", "id": str(result.inserted_id)}

@router.post("/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.strip().lower()
    password = request.password.strip()
    
    # 1. Search in admins collection first
    user = db.admins.find_one({"email": email})
    is_admin = True
    
    # 2. Search in users collection if not found in admins
    if not user:
        user = db.users.find_one({"email": email})
        is_admin = False
        
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Check active status (default to True for admin if field is missing)
    is_active = user.get("isActive", True)
    if not is_active:
        raise HTTPException(status_code=401, detail="Account is inactive")
        
    # Get hashed password from DB
    hashed_password = user.get("password")
    if not hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Validate password using the utility function from utils.auth
    if not verify_password(password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Get user information
    user_id = str(user.get("_id"))
    user_name = user.get("name") if is_admin else user.get("fullName", "User")
    user_role = user.get("role", "admin" if is_admin else "user")
    
    # Create JWT access token using the utility function from utils.auth
    expires_delta = timedelta(days=7) if request.remember else timedelta(hours=24)
    
    jwt_payload = {
        "id": user_id,
        "email": email,
        "name": user_name,
        "role": user_role
    }
    
    token = create_access_token(data=jwt_payload, expires_delta=expires_delta)
        
    # Set HTTP-only cookie matching frontend structure
    max_age = 60 * 60 * 24 * 7 if request.remember else 60 * 60 * 24
    
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        samesite="lax",
        path="/",
        max_age=max_age,
        secure=os.getenv("NODE_ENV") == "production"
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": email,
            "name": user_name,
            "role": user_role
        }
    }
