import os
import json
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "healthtech_db")

DATA_DIR = os.path.join(os.path.dirname(__file__), '../excel_sheets_data')

async def import_collection(collection_name, json_file, id_field=None):
    print(f"Importing {collection_name} from {json_file} ...")
    with open(json_file, encoding='utf-8') as f:
        data = json.load(f)
    # Convert string IDs to ObjectId if needed
    for doc in data:
        if id_field and id_field in doc:
            doc['_id'] = ObjectId()  # Generate new ObjectId
    await db[collection_name].delete_many({})
    if data:
        await db[collection_name].insert_many(data)
    print(f"Inserted {len(data)} documents into {collection_name}")

async def main():
    global db
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    # Import each collection
    await import_collection('ClinicsHospitals', os.path.join(DATA_DIR, 'Clinics_&_Hospital.json'))
    await import_collection('Locations', os.path.join(DATA_DIR, 'Locations.json'))
    await import_collection('ProcedureOfferings', os.path.join(DATA_DIR, 'Procedure_Offerings.json'))
    await import_collection('Providers', os.path.join(DATA_DIR, 'Provider.json'))
    print("All data imported!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main()) 