# sample config file

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

SECRET_KEY=os.getenv('SECRET_KEY')
HOST=os.getenv('HOST')
DBNAME=os.getenv('DBNAME')
USER=os.getenv('USER', "vaadminevva")
PASSWORD=os.getenv('PASSWORD')
CONNECTION_STRING=os.getenv('CONNECTION_STRING')


HOST_EVVA=os.getenv('HOST_EVVA')
DBNAME_EVVA=os.getenv('DBNAME_EVVA')
USER_EVVA=os.getenv('USER_EVVA', "vaadminevva")
PASSWORD_EVVA=os.getenv('PASSWORD_EVVA')


BASE_URL=os.getenv('BASE_URL')
