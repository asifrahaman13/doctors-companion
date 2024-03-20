from datetime import timedelta
from src.infastructure.repositories.auth_repository import AuthRepository
from src.domain.interfaces.auth_interface import AuthInterface


class AuthenticationService:

    def __call__(self) -> AuthInterface:
        return self

    def __init__(self, auth_repository=AuthRepository):
        self.auth_repository = auth_repository()

    def create_access_token(self, data: dict, expires_delta: timedelta):
        return self.auth_repository.create_access_token(data, expires_delta)

    def get_current_user(self, token: str):
        return self.auth_repository.get_current_user(token)
