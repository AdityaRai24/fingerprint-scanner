from fastapi import APIRouter, HTTPException
from database.supabase_client import supabase
from utils.hash_utils import image_hash
from pydantic import BaseModel
import cv2
import numpy as np
import base64
import json  # Changed from pickle to json
from typing import Optional

router = APIRouter(tags=["register"])

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    address: str
    additional_info: str
    face_image: Optional[str] = None
    thumb_image: Optional[str] = None

def extract_features(base64_str: str):
    """
    Extract ORB features from base64 image string for storage
    Returns:
        Tuple[str, int] -> base64 feature string, number of keypoints
    """
    if not base64_str:
        return None, 0
        
    print("🔍 Extracting features for storage...")

    try:
        encoded_data = base64_str.split(",")[1]
        img_data = base64.b64decode(encoded_data)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)

        print(f"📸 Image decoded - Shape: {img.shape}")

        # Reduce nfeatures from 500 to 200 to make data smaller
        orb = cv2.ORB_create(nfeatures=500)
        keypoints, descriptors = orb.detectAndCompute(img, None)

        if descriptors is not None:
            print(f"✅ Extracted {len(keypoints)} keypoints for storage")
            
            # FIXED: Store as JSON instead of pickle to avoid truncation
            # Convert numpy array to list for JSON serialization
            descriptors_list = descriptors.tolist()
            descriptors_dict = {
                'shape': descriptors.shape,
                'dtype': str(descriptors.dtype),
                'data': descriptors_list
            }
            
            # Serialize as JSON string
            json_features = json.dumps(descriptors_dict)
            print(f"📏 JSON serialized size: {len(json_features)} characters")
            
            # Encode as base64 for storage
            base64_features = base64.b64encode(json_features.encode('utf-8')).decode('utf-8')
            print(f"📏 Base64 encoded size: {len(base64_features)} characters")
            
            return base64_features, len(keypoints)
        else:
            print("❌ No features found in image")
            return None, 0

    except Exception as e:
        print(f"❌ Feature extraction error: {e}")
        return None, 0
    
@router.post("/")
async def register_user(req: RegisterRequest):
    try:
        print(f"\n🚀 Starting user registration for: {req.first_name} {req.last_name}")
        
        # Step 1: Generate hashes using your existing image_hash function
        print("📋 Step 1: Generating perceptual hashes")
        
        face_hash = None
        thumb_hash = None
        
        if req.face_image:
            face_hash = image_hash(req.face_image)
            print(f"🔢 Face hash generated: {face_hash[:16]}... (showing first 16 bits)")
        else:
            print("⚠️  No face image provided")
            
        if req.thumb_image:
            thumb_hash = image_hash(req.thumb_image)
            print(f"🔢 Thumb hash generated: {thumb_hash[:16]}... (showing first 16 bits)")
        else:
            print("⚠️  No thumb image provided")
        
        # Step 2: Get hash buckets
        print("📋 Step 2: Computing hash buckets")
        
        face_bucket = None
        thumb_bucket = None
        
        if face_hash:
            try:
                bucket_res = supabase.rpc("get_hash_bucket", {"hash": face_hash}).execute()
                face_bucket = bucket_res.data
                print(f"🪣 Face hash bucket: {face_bucket}")
            except Exception as e:
                print(f"❌ Error getting face hash bucket: {e}")
                
        if thumb_hash:
            try:
                bucket_res = supabase.rpc("get_hash_bucket", {"hash": thumb_hash}).execute()
                thumb_bucket = bucket_res.data
                print(f"🪣 Thumb hash bucket: {thumb_bucket}")
            except Exception as e:
                print(f"❌ Error getting thumb hash bucket: {e}")
        
        # Step 3: Extract OpenCV features (now using JSON format)
        print("📋 Step 3: Extracting OpenCV features")

        face_features_str = None
        thumb_features_str = None

        if req.face_image:
            face_features_tuple = extract_features(req.face_image)
            if face_features_tuple[0]:  # Check if base64_features is not None
                face_features_str = face_features_tuple[0]  # Extract only the base64 string
                print(f"✅ Face features extracted successfully (JSON format)")
            else:
                print("⚠️  Failed to extract face features")
                
        if req.thumb_image:
            thumb_features_tuple = extract_features(req.thumb_image)
            if thumb_features_tuple[0]:  # Check if base64_features is not None
                thumb_features_str = thumb_features_tuple[0]  # Extract only the base64 string
                print(f"✅ Thumb features extracted successfully (JSON format)")
            else:
                print("⚠️  Failed to extract thumb features")

        # Step 4: Prepare user data for insertion
        print("📋 Step 4: Preparing user data for database insertion")

        user_data = {
            "auth_id": "2bb80095-dd6a-4226-9822-ffc81d20c1cf",
            "first_name": req.first_name,
            "last_name": req.last_name,
            "address": req.address,
            "additional_info": req.additional_info,
            "face_image": req.face_image,
            "thumb_image": req.thumb_image,
            "face_hash": face_hash,
            "thumb_hash": thumb_hash,
            "face_hash_bucket": face_bucket,
            "thumb_hash_bucket": thumb_bucket,
            "face_features_orb": face_features_str,  # Store as JSON (base64 encoded)
            "thumb_features_orb": thumb_features_str  # Store as JSON (base64 encoded)
        }
        
        
        print(f"📊 User data prepared:")
        print(f"   - Name: {req.first_name} {req.last_name}")
        print(f"   - Face hash: {'✅' if face_hash else '❌'}")
        print(f"   - Thumb hash: {'✅' if thumb_hash else '❌'}")
        print(f"   - Face features: {'✅' if face_features_str else '❌'}")
        print(f"   - Thumb features: {'✅' if thumb_features_str else '❌'}")
        print(f"   - Face bucket: {face_bucket}")
        print(f"   - Thumb bucket: {thumb_bucket}")
        
        # Step 5: Insert user into database
        print("📋 Step 5: Inserting user into database")
        
        result = supabase.table("users").insert(user_data).execute()
        
        if result.data:
            user_id = result.data[0]["id"]
            print(f"✅ USER REGISTRATION SUCCESSFUL!")
            print(f"   - User ID: {user_id}")
            print(f"   - Name: {req.first_name} {req.last_name}")
            print(f"   - Biometric data stored: Face({'✅' if face_hash else '❌'}), Thumb({'✅' if thumb_hash else '❌'})")
            
            return {
                "success": True,
                "message": "User registered successfully",
                "user_id": user_id,
                "biometric_info": {
                    "face_hash_generated": face_hash is not None,
                    "thumb_hash_generated": thumb_hash is not None,
                    "face_features_extracted": face_features_str is not None,
                    "thumb_features_extracted": thumb_features_str is not None,
                    "face_bucket": face_bucket,
                    "thumb_bucket": thumb_bucket
                }
            }
        else:
            raise Exception("Failed to insert user - no data returned")
            
    except Exception as e:
        print(f"💥 Registration failed: {e}")
        
        # Provide specific error messages
        if "duplicate key" in str(e).lower():
            raise HTTPException(status_code=400, detail="User already exists")
        elif "null value" in str(e).lower():
            raise HTTPException(status_code=400, detail="Missing required fields")
        elif "face_features_orb" in str(e) or "thumb_features_orb" in str(e):
            raise HTTPException(
                status_code=500, 
                detail="Database schema error - OpenCV feature columns missing. Please add face_features_orb and thumb_features_orb columns to users table."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

# Optional: Health check endpoint to verify feature extraction is working
@router.get("/test-features")
async def test_feature_extraction():
    """Test endpoint to verify OpenCV feature extraction is working"""
    try:
        # Create a simple test image
        test_img = np.random.randint(0, 255, (100, 100), dtype=np.uint8)
        _, buffer = cv2.imencode('.jpg', test_img)
        test_base64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode()
        
        # Test feature extraction
        features = extract_features(test_base64)
        
        return {
            "opencv_working": True,
            "features_extracted": features is not None,
            "message": "OpenCV feature extraction is working correctly"
        }
    except Exception as e:
        return {
            "opencv_working": False,
            "error": str(e),
            "message": "OpenCV feature extraction failed"
        }