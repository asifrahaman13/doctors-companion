from pydantic import BaseModel
from sqlmodel import SQLModel, Field, JSON
from typing import List, Optional


class User(BaseModel):
    user_id: str | None = None
    username: str | None = None


class Vadata(SQLModel, table=True):
    membername: str | None = Field(primary_key=True)
    orgname: str | None = None
    memberpass: str | None = None
    s3link: str | None = None
    emailaddress: str | None = None


class UserBase(BaseModel):
    membername: str | None = None
    memberpass: str | None = None


class UserData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str | None = None
    visitId: str | None = None
    mrn: str | None = None
    details: list[str] = Field(sa_type=JSON, default=[])
    patient_name: str | None = None
    timestamp: str | None = None
    date: str | None = None
    dob: str | None = None
    gender: str | None = None
    prev: list[str] = Field(sa_type=JSON, default=["{}"])


class InformLogin(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = None
    timestamp: str = None


class VeteranData(SQLModel, table=True):
    __tablename__ = "veteran_data"
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: str | None = None
    result: list[str] = Field(sa_type=JSON, default=[])  # Using JSON type for details


class Prev(BaseModel):
    privJson: str | None = None
    privSpeakerId: str | None = None


class PatientData(BaseModel):
    detail: str | None = None
    details: list[str] | None = None
    visitId: str | None = None
    mrn: str | None = None
    date: str | None = None
    patient_name: str | None = None
    timestamp: str | None = None
    date: str | None = None
    dob: str | None = None
    gender: str | None = None
    prev: list[Prev] | None = None


class VitalSigns(BaseModel):
    Heart_Rate: Optional[str]
    Temperature: Optional[str]
    Blood_Pressure: Optional[str]
    Respiratory_Rate: Optional[str]
    Oxygen_Saturation: Optional[str]


class Problem(BaseModel):
    Problem_Number: int
    Problem_Description: str


class Assessment(BaseModel):
    ProblemList: List[Problem]
    Assessment_Description: str
    Differential_Diagnoses: List[str]


class TreatmentPlan(BaseModel):
    Pharmacotherapy: str
    Patient_Education: str
    Other_Therapeutic_Procedures: str


class Plan(BaseModel):
    Treatment_Plan: TreatmentPlan
    Diagnostic_Plan: str
    FollowUp: str | None = None


class Objective(BaseModel):
    Lab_Data: str
    VitalSigns: VitalSigns
    Physical_Exam: str


class Subjective(BaseModel):
    History_of_PresentIllness: str
    Review_of_Systems: str
    Current_Medications: List[dict]
    Pertinent_Past_MedicalHistory: str
    Medication_Allergies: str | None = None
    Family_History: str | None = None
    Social_History: str | None = None


class Summary(BaseModel):
    Plan: Plan
    Summary: str | None = None
    Objective: Objective
    Assessment: Assessment
    Subjective: Subjective


class PatientDataUpdate(BaseModel):
    visitId: str | None = None
    details: List[str]
    summary: Summary | None = None
