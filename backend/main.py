from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/healthtech_db")
DB_NAME = os.getenv("DB_NAME", "healthtech_db")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "localhost")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]

@app.get("/clinics-hospitals")
async def get_clinics_hospitals():
    print("[API] /clinics-hospitals called")
    docs = await db["ClinicsHospitals"].find().to_list(1000)
    print(f"[API] /clinics-hospitals returning {len(docs)} records")
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.get("/locations")
async def get_locations(clinicId: str = Query(...)):
    print(f"[API] /locations called with clinicId={clinicId}")
    docs = await db["Locations"].find({"Clinic ID": clinicId}).to_list(100)
    print(f"[API] /locations returning {len(docs)} records")
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.get("/procedure-offerings")
async def get_procedure_offerings(clinicId: str = Query(...), locationId: str = Query(...)):
    print(f"[API] /procedure-offerings called with clinicId={clinicId}, locationId={locationId}")
    docs = await db["ProcedureOfferings"].find({"Clinic ID": clinicId, "Location ID": locationId}).to_list(100)
    print(f"[API] /procedure-offerings returning {len(docs)} records")
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.get("/providers")
async def get_providers(ids: str = Query(...)):
    print(f"[API] /providers called with ids={ids}")
    id_list = [i for i in ids.split(",") if i]
    docs = await db["Providers"].find({"Provider ID": {"$in": id_list}}).to_list(100)
    print(f"[API] /providers returning {len(docs)} records")
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs 


from fastapi.staticfiles import StaticFiles
import os

app.mount(
    "/",
         StaticFiles(directory=os.path.join(os.path.dirname(__file__), "../frontend/build"), html=True),
         name="static",
     )