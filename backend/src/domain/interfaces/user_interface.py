# src/core/interfaces/user_interface.py
from abc import ABC, abstractmethod
from src.domain.entities.user import User
from typing import Optional
from datetime import datetime, timedelta
from src.domain.entities.user import PatientData, InformLogin


class UserInterface(ABC):
    @abstractmethod
    def get_data(self, current_user: str):
        pass

    @abstractmethod
    def check_user(self, membername, memberpass):
        pass

    @abstractmethod
    def store_data(self, current_user: str, patient: PatientData):
        pass

    @abstractmethod
    def append_data(self, patient: PatientData):
        pass

    @abstractmethod
    def get_patient_data(self, patient_id: str, current_user: str):
        pass

    @abstractmethod
    def get_summary(self, patient_id: str):
        pass

    @abstractmethod
    def inform_login(self, username: str):
        pass

    @abstractmethod
    def save_detailed_data(self, patient_id:str, prev):
        pass

    @abstractmethod
    def update_transctiption(self, patient_id:str, details, summary):
        pass
