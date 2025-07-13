from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid objectid')
        return ObjectId(v)
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type='string')

class ClinicHospitalModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Clinic_Name_EN: str = Field(..., alias="Clinic Name (EN)")
    # Add other fields as needed
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class LocationModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Clinic_ID: Optional[str] = Field(None, alias="Clinic ID")
    # Add other fields as needed
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProviderModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Provider_ID: Optional[str] = Field(None, alias="Provider ID")
    Full_Name_ENG: Optional[str] = Field(None, alias="Full Name(ENG)")
    # Add other fields as needed
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ProcedureOfferingModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    Clinic_ID: Optional[str] = Field(None, alias="Clinic ID")
    Location_ID: Optional[str] = Field(None, alias="Location ID")
    Provider_IDs: Optional[List[str]] = Field(default_factory=list, alias="Provider ID")
    # Add other fields as needed
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str} 