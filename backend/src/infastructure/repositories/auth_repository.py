from datetime import datetime, timedelta
from jose import JWTError, jwt
from config.config import SECRET_KEY


class AuthRepository:
    
    def __init__(self):
        self.secret_key = SECRET_KEY

    def create_access_token(self, data: dict, expires_delta: timedelta) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm="HS256")
        return encoded_jwt

    def get_current_user(self, token) -> str:

        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            username: str = payload.get("sub")
            if username is None:
                return False

        except JWTError:
            return False

        return username
