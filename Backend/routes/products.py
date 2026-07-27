import re
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from database import get_db
from models import ProductResponse, ProductCreate
from bson import ObjectId
from utils.auth import require_admin

router = APIRouter()

def product_helper(prod) -> dict:
    """Convert MongoDB document to a clean dict with string id."""
    return {
        "id": str(prod["_id"]),
        "name": prod["name"],
        "sku": prod.get("sku", None),
        "price": prod.get("price", 0.0),
        "stock": prod.get("stock", 0),
        "status": prod.get("status", "active"),
        "category_id": prod.get("category_id", None),
        "description": prod.get("description", None),
        "features": prod.get("features", []),
        "specifications": prod.get("specifications", {}),
        "image": prod.get("image", None),
        "moq": prod.get("moq", "200 PCS"),
        "unit": prod.get("unit", "pcs"),
        "isUlApproved": prod.get("isUlApproved", False),
        "datasheet": prod.get("datasheet", None),
        # Generic Variant Pricing Fields
        "hasVariantPricing": prod.get("hasVariantPricing", False),
        "variantType": prod.get("variantType", "Size"),
        "variants": prod.get("variants", []),
        "customSpecifications": prod.get("customSpecifications", {}),
    }

def validate_product_variants(product_dict: dict):
    if product_dict.get("hasVariantPricing", False):
        variants = product_dict.get("variants", [])
        if not variants or len(variants) == 0:
            raise HTTPException(status_code=400, detail="At least one variant is mandatory when variant pricing is enabled.")
        
        labels = []
        default_count = 0
        for v in variants:
            label = str(v.get("label", "")).strip()
            unit = str(v.get("unit", "")).strip()
            price = float(v.get("price", 0.0))
            
            if not label:
                raise HTTPException(status_code=400, detail="Variant label cannot be empty.")
            if not unit:
                raise HTTPException(status_code=400, detail="Variant unit cannot be empty.")
            if price <= 0:
                raise HTTPException(status_code=400, detail="Variant price must be greater than zero.")
            
            labels.append(label)
            if v.get("isDefault", False):
                default_count += 1
        
        if len(labels) != len(set(labels)):
            raise HTTPException(status_code=400, detail="Duplicate variants are not allowed.")
        
        # Ensure exactly one variant is default
        if default_count == 0:
            variants[0]["isDefault"] = True
        elif default_count > 1:
            found_default = False
            for v in variants:
                if v.get("isDefault", False):
                    if not found_default:
                        found_default = True
                    else:
                        v["isDefault"] = False

@router.get("/", response_model=List[ProductResponse])
def get_products():
    db = get_db()
    products = list(db.products.find())
    return [product_helper(prod) for prod in products]

@router.get("/slug/{product_slug}", response_model=ProductResponse)
def get_product_by_slug(product_slug: str):
    db = get_db()
    
    def slugify_name(text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'\s+', '-', text)
        text = re.sub(r'[^\w\-]', '', text)
        text = re.sub(r'\-+', '-', text)
        return text.strip('-')

    products = list(db.products.find())
    
    # Phase 1: Try exact match (including suffix)
    for prod in products:
        prod_id_str = str(prod["_id"])
        try:
            suffix = str(int(prod_id_str, 16) % 10000000).rjust(7, '0')
        except Exception:
            continue
        
        name_slug = slugify_name(prod["name"])
        if f"{name_slug}-{suffix}" == product_slug:
            return product_helper(prod)
            
    # Phase 2: Fallback - Match by name slug (ignoring the suffix)
    match = re.match(r"^(.*)-(\d+)$", product_slug)
    if match:
        name_part = match.group(1)
        for prod in products:
            if slugify_name(prod["name"]) == name_part:
                return product_helper(prod)
            
    raise HTTPException(status_code=404, detail="Product not found")

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    prod = db.products.find_one({"_id": ObjectId(product_id)})
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_helper(prod)

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    product_dict = product.model_dump()
    validate_product_variants(product_dict)
    result = db.products.insert_one(product_dict)
    product_dict["_id"] = result.inserted_id
    return product_helper(product_dict)

@router.delete("/{product_id}")
def delete_product(product_id: str, admin: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    result = db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, product: ProductCreate, admin: dict = Depends(require_admin)):
    db = get_db()
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    product_dict = product.model_dump()
    validate_product_variants(product_dict)
    result = db.products.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": product_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
        
    updated_prod = db.products.find_one({"_id": ObjectId(product_id)})
    return product_helper(updated_prod)
