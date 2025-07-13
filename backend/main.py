from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "healthtech_db")

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]

@app.get("/clinics-hospitals")
async def get_clinics_hospitals():
    docs = await db["ClinicsHospitals"].find().to_list(1000)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.get("/locations")
async def get_locations(clinicId: str = Query(...)):
    docs = await db["Locations"].find({"Clinic ID": clinicId}).to_list(100)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.get("/procedure-offerings")
async def get_procedure_offerings(clinicId: str = Query(...), locationId: str = Query(...)):
    docs = await db["ProcedureOfferings"].find({"Clinic ID": clinicId, "Location ID": locationId}).to_list(100)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs

@app.get("/providers")
async def get_providers(ids: str = Query(...)):
    # ids is a comma-separated string of ObjectIds
    id_list = [i for i in ids.split(",") if i]
    docs = await db["Providers"].find({"Provider ID": {"$in": id_list}}).to_list(100)
    for doc in docs:
        doc["_id"] = str(doc["_id"])
    return docs 