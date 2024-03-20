# src/application/web/controllers/user_controller.py

from fastapi import APIRouter, Depends, HTTPException, status
from src.domain.interfaces.user_interface import UserInterface
from src.domain.use_cases.user_service import UserService
from src.infastructure.repositories.user_repository import UserRepository
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from src.domain.entities.user import UserBase, UserData, PatientData, PatientDataUpdate
from src.infastructure.repositories.auth_repository import AuthRepository
from src.domain.use_cases.auth_service import AuthenticationService
from src.domain.interfaces.auth_interface import AuthInterface

from src.infastructure.exceptions.exceptions import HttePrequestErrors


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
user_repository = UserRepository()
user_service = UserService(user_repository)
auth_repository = AuthRepository()
auth_service = AuthenticationService()


def get_current_user(token: str = Depends(oauth2_scheme)):
    return token


@router.post("/login")
async def all_data(
    user: UserBase,
    user_interface: UserInterface = Depends(user_service),
    auth_interface: AuthInterface = Depends(auth_service),
):
    user_data = user.model_dump()
    membername = user_data["membername"]
    memberpass = user_data["memberpass"]


    try:
        if user_interface.check_user(membername, memberpass):
            # Generate an access token
            access_token_expires = timedelta(hours=6)
            access_token = auth_interface.create_access_token(data={"sub": membername}, expires_delta=access_token_expires)
            data=user_interface.inform_login(membername)
            return {"access_token": access_token, "token_type": "bearer", "data":data}
        else:
            print("He is not authorized.")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get("/authenticate")
async def get_protected_data(current_user: str = Depends(get_current_user), auth_interface: AuthInterface = Depends(auth_service)):
    user = auth_interface.get_current_user(current_user)

    if user == False:
        return HttePrequestErrors.unauthorized()
    return {"message": True, "user": user}


@router.post("/store-data")
async def store_data(
    patient: PatientData,
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service),
):
   
    try:
    
        patient = patient.model_dump()
        current_user = auth_interface.get_current_user(current_user)
        patient["user_id"] = current_user
        # current_date = datetime.now().strftime("%Y-%m-%d")
        # patient["date"] = current_date
        is_stored = user_interface.store_data(current_user, patient)
  
        return is_stored
    except Exception as e:
        print(e)

    return False


@router.post("/append-data")
async def store_data(
    patient: PatientData,
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service),
):
    patient = patient.model_dump()
    try:
        current_user = auth_interface.get_current_user(current_user)
        is_added = user_interface.append_data(current_user, patient)
        return is_added
    except Exception as e:
        print(e)
        return False


@router.get("/get-data")
async def get_data(
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service),
):
    user_data = []
    try:
        user = auth_interface.get_current_user(current_user)
        user_data = user_interface.get_data(user)
        print(type(user_data))
    except Exception as e:

        return HttePrequestErrors.internal_server_error()

    return user_data


@router.post("/get-patient")
async def get_data(
    patient_id: UserData,
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service),
):
    print(patient_id)
    patient_id = patient_id.model_dump()
    user_data = {}
    try:
        current_user = auth_interface.get_current_user(current_user)
        user_data = user_interface.get_patient_data(patient_id["visitId"], current_user)
    except Exception as e:
        return HttePrequestErrors.internal_server_error()
    return user_data


@router.post("/get-summary")
async def get_summary(
    patient_id: UserData,  # Annotate patient_id as a string
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service),
):
    patient_id = patient_id.model_dump()
    user = auth_interface.get_current_user(current_user)
    if user == False:
        return HttePrequestErrors.unauthorized()
    user_data = []
    try:
        user_data = user_interface.get_summary(patient_id["visitId"])
    except Exception as e:
        return HttePrequestErrors.internal_server_error()

    return user_data


@router.post("/store-for-csv-data")
async def store_data(
    patient: PatientData,
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service),
):
    print(patient)
    try:
        patient = patient.model_dump()
        current_user = auth_interface.get_current_user(current_user)
        store_csv_data=user_interface.save_detailed_data(patient['visitId'], patient['prev'])
        return store_csv_data
    except Exception as e:
        print(e)

    return False


@router.post("/update-transcript")
async def update_transcript( patient: PatientDataUpdate,
    current_user: str = Depends(get_current_user),
    auth_interface: AuthInterface = Depends(auth_service),
    user_interface: UserInterface = Depends(user_service)):
    patient=patient.model_dump()
    user = auth_interface.get_current_user(current_user)
    print(patient)
    if user == False:
        return HttePrequestErrors.unauthorized()
    try:
        update_data=user_interface.update_transctiption(patient['visitId'], patient['details'], patient['summary'])
        return update_data

    except Exception as e:
        print(e)
    return False