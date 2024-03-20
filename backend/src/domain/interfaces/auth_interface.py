# src/core/interfaces/user_interface.py
from abc import ABC, abstractmethod
from src.domain.entities.user import User
from typing import Optional
from datetime import datetime, timedelta


class AuthInterface(ABC):

    @abstractmethod
    def create_access_token(self, data: dict, expires_delta: timedelta):
        pass

    @abstractmethod
    def get_current_user(
        self,
    ):
        pass
