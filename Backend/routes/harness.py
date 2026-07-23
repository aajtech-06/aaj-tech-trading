from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from database import get_db
from models import HarnessProductResponse, HarnessProductCreate, HarnessCategoryResponse, HarnessCategoryCreate
from bson import ObjectId
from utils.auth import require_admin

router = APIRouter()

def harness_helper(item) -> dict:
    """Convert MongoDB document to a clean dict with string id."""
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "details": item.get("details", ""),
        "image": item.get("image", ""),
        "voltageType": item.get("voltageType", ""),
        "subcategory": item.get("subcategory", ""),
        "spacing": item.get("spacing", ""),
        "bottomPlateType": item.get("bottomPlateType", ""),
        "pinQuantity": item.get("pinQuantity", ""),
        "productStatus": item.get("productStatus", ""),
        "galleryImages": item.get("galleryImages", []),
    }

def category_helper(item) -> dict:
    """Convert MongoDB category document to a clean dict with string id."""
    return {
        "id": str(item["_id"]),
        "name": item["name"],
        "voltageType": item.get("voltageType", ""),
    }

# Categories CRUD Endpoints
@router.get("/categories", response_model=List[HarnessCategoryResponse])
def get_harness_categories(voltageType: Optional[str] = None):
    db = get_db()
    # Seed default categories if none exist to prevent blank page
    if db.harness_categories.count_documents({}) == 0:
        default_categories = [
            {"name": "Electronic & Communication Harness", "voltageType": "Low Voltage Harness"},
            {"name": "Automotive Harness", "voltageType": "Low Voltage Harness"},
            {"name": "Industrial Harness", "voltageType": "Low Voltage Harness"},
            {"name": "Medical Harness", "voltageType": "Low Voltage Harness"},
            {"name": "Telecom Harness", "voltageType": "Low Voltage Harness"},
            {"name": "Solar Harness", "voltageType": "High Voltage Harness"},
            {"name": "Battery Charging Harness", "voltageType": "High Voltage Harness"},
            {"name": "EV Harness", "voltageType": "High Voltage Harness"},
            {"name": "Energy Storage Harness", "voltageType": "High Voltage Harness"},
            {"name": "Industrial High Voltage Harness", "voltageType": "High Voltage Harness"},
        ]
        db.harness_categories.insert_many(default_categories)

    query = {}
    if voltageType:
        if voltageType.upper() == "LOW" or voltageType.lower() == "low voltage harness":
            query["voltageType"] = "Low Voltage Harness"
        elif voltageType.upper() == "HIGH" or voltageType.lower() == "high voltage harness":
            query["voltageType"] = "High Voltage Harness"
        else:
            query["voltageType"] = voltageType

    items = list(db.harness_categories.find(query))
    return [category_helper(item) for item in items]

@router.post("/categories", response_model=HarnessCategoryResponse)
def create_harness_category(item: HarnessCategoryCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    item_dict = item.model_dump()
    result = db.harness_categories.insert_one(item_dict)
    item_dict["_id"] = result.inserted_id
    return category_helper(item_dict)

@router.put("/categories/{id}", response_model=HarnessCategoryResponse)
def update_harness_category(id: str, item: HarnessCategoryCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    item_dict = item.model_dump()
    result = db.harness_categories.update_one(
        {"_id": ObjectId(id)},
        {"$set": item_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Harness Category not found")
    updated_item = db.harness_categories.find_one({"_id": ObjectId(id)})
    return category_helper(updated_item)

@router.delete("/categories/{id}")
def delete_harness_category(id: str, admin: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = db.harness_categories.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Harness Category not found")
    return {"message": "Harness Category deleted successfully"}

@router.get("/", response_model=List[HarnessProductResponse])
def get_harness_products(voltageType: Optional[str] = None, subcategory: Optional[str] = None):
    db = get_db()
    query = {}
    if voltageType:
        val = voltageType.upper()
        if val == "LOW" or val == "LOW VOLTAGE HARNESS":
            query["$or"] = [
                {"voltageType": "Low Voltage Harness"},
                {"voltageType": {"$exists": False}},
                {"voltageType": ""}
            ]
        elif val == "HIGH" or val == "HIGH VOLTAGE HARNESS":
            query["voltageType"] = "High Voltage Harness"
        else:
            query["voltageType"] = voltageType
    if subcategory:
        query["subcategory"] = subcategory

    items = list(db.harness_products.find(query))
    return [harness_helper(item) for item in items]

@router.get("/{id}", response_model=HarnessProductResponse)
def get_harness_product(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    item = db.harness_products.find_one({"_id": ObjectId(id)})
    if not item:
        raise HTTPException(status_code=404, detail="Harness Product not found")
    return harness_helper(item)

@router.post("/", response_model=HarnessProductResponse)
def create_harness_product(item: HarnessProductCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    item_dict = item.model_dump()
    result = db.harness_products.insert_one(item_dict)
    item_dict["_id"] = result.inserted_id
    return harness_helper(item_dict)

@router.delete("/{id}")
def delete_harness_product(id: str, admin: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    result = db.harness_products.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Harness Product not found")
    return {"message": "Harness Product deleted successfully"}

@router.put("/{id}", response_model=HarnessProductResponse)
def update_harness_product(id: str, item: HarnessProductCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")

    item_dict = item.model_dump()
    result = db.harness_products.update_one(
        {"_id": ObjectId(id)},
        {"$set": item_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Harness Product not found")

    updated_item = db.harness_products.find_one({"_id": ObjectId(id)})
    return harness_helper(updated_item)
