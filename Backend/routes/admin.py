from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import bcrypt

from database import get_db
from utils.auth import require_admin

router = APIRouter()

class AdminManageLoginRequest(BaseModel):
    email: str
    name: Optional[str] = None
    password: str

class AdminDeleteRequest(BaseModel):
    email: str

def admin_helper(admin) -> dict:
    return {
        "_id": str(admin["_id"]),
        "email": admin.get("email"),
        "name": admin.get("name", "")
    }

@router.get("/manage-login", response_model=List[dict])
def get_admins(current_user: dict = Depends(require_admin)):
    db = get_db()
    admins = list(db.admins.find())
    return [admin_helper(admin) for admin in admins]

@router.post("/manage-login")
def save_credentials(request: AdminManageLoginRequest, current_user: dict = Depends(require_admin)):
    db = get_db()
    email = request.email.strip().lower()
    name = request.name.strip() if request.name else ""
    password = request.password.strip()

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )
        
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')
    
    # Check if admin already exists
    existing_admin = db.admins.find_one({"email": email})
    
    if existing_admin:
        # Update existing admin
        update_data = {
            "password": hashed_password,
            "updatedAt": datetime.utcnow()
        }
        if name:
            update_data["name"] = name
            
        db.admins.update_one(
            {"_id": existing_admin["_id"]},
            {"$set": update_data}
        )
        return {"message": "Credentials updated successfully"}
    else:
        # Create a new admin
        new_admin = {
            "email": email,
            "password": hashed_password,
            "name": name if name else "Admin User",
            "role": "admin",
            "createdAt": datetime.utcnow()
        }
        db.admins.insert_one(new_admin)
        return {"message": "Credentials saved successfully"}

@router.delete("/manage-login")
def delete_admin(request: AdminDeleteRequest, current_user: dict = Depends(require_admin)):
    db = get_db()
    email = request.email.strip().lower()
    
    # Do not allow admin to delete themselves
    if current_user.get("email") == email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete yourself"
        )
        
    result = db.admins.delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
        
    return {"message": "Admin removed successfully"}
