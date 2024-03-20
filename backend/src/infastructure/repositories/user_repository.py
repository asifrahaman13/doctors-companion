# src/infrastructure/repositories/user_repository.py

from src.domain.entities.user import UserData, Vadata, VeteranData
from sqlmodel import Session, create_engine, select
from urllib.parse import quote
from src.domain.entities.user import PatientData, InformLogin
from config.config import HOST, DBNAME, USER, PASSWORD, HOST_EVVA, DBNAME_EVVA, USER_EVVA, PASSWORD_EVVA
from sqlmodel import SQLModel
from datetime import datetime

class UserRepository:
    
    def __init__(self):
        self.db_params = {
            "host": HOST,
            "dbname": DBNAME,
            "user": "vaadminevva",
            "password": PASSWORD,
        }
        self.encoded_password = quote(self.db_params["password"])
        # self.encoded_password = quote(self.db_params["password"])
        DATABASE_URL = f"postgresql://{self.db_params['user']}:{self.encoded_password}@{self.db_params['host']}:{5432}/{self.db_params['dbname']}"
        connect_args = {}
        self.engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

        self.db_params_evva = {
            "host": HOST_EVVA,
            "dbname": DBNAME_EVVA,
            "user": "visitcompanion",
            "password": PASSWORD_EVVA,
        }
        self.encoded_password_evva = quote(self.db_params_evva["password"])
        # self.encoded_password = quote(self.db_params["password"])
        DATABASE_URL_EVVA = f"postgresql://{self.db_params_evva['user']}:{self.encoded_password_evva}@{self.db_params_evva['host']}:{5432}/{self.db_params_evva['dbname']}"
        connect_args = {}
        self.engine_evva = create_engine(DATABASE_URL_EVVA, echo=True, connect_args=connect_args)
        
        # The following line of code is very important to actually create table corresponding to the ORMs.
        SQLModel.metadata.create_all(self.engine)

    def check_user(self, membername: str, memberpass: str) -> bool:
        with Session(self.engine) as session:
            statement = select(Vadata).where(Vadata.membername == membername)
            results = session.exec(statement).first()
        
            if results.memberpass == memberpass:
                return True
        return False

    def get_data(self, current_user: str):
        user_data = []
        try:
            with Session(self.engine) as session:
                # Assuming you want to fetchall records, adjust the query as needed
                user_data_list = select(UserData).where(UserData.user_id == current_user)
                results = session.exec(user_data_list)
               
                for hero in results:
                    data = hero.model_dump()
                    user_data.append(data)
                session.close()
        except Exception as e:
            print(e)
        user_data.reverse()
        return user_data

    def get_patient_data(self, visitId: str, current_user: str):
        user_data = {}
        try:
            with Session(self.engine) as session:
             
                # Assuming you want to fetchall records, adjust the query as needed
                user_data_list = select(UserData).where((UserData.visitId == visitId) & (UserData.user_id == current_user))
                results = session.exec(user_data_list).first()
                session.close()
                return results.model_dump()
        except Exception as e:
            print(e)

        return user_data

    def append_data(self, current_user: str, patient: PatientData):
        try:
            with Session(self.engine) as session:
                # Check if entry exists
                statement = select(UserData).where(UserData.visitId == patient["visitId"])
                existing_data = session.exec(statement).first()
                # existing_data = session.query(UserData).filter(UserData.visitId == patient['visitId']).first()

                if existing_data:
                    # Entry exists, append the new detail
                    if patient["detail"] != "":
                        updated_details = existing_data.details + [patient["detail"]]
                        existing_data.details = updated_details
                else:
                    # Entry doesn't exist, create a new one
                    new_data = UserData(
                        user_id=current_user,  # Assuming current_user is the user_id
                        details=[patient["detail"]],  # Initialize details with the new detail
                        visitId=patient["visitId"],
                        patient_name=patient["patient_name"],
                        date=patient["date"],
                    )
                    session.add(new_data)

                session.commit()
                session.close()  # Ensure session is closed after committing changes
                return True
        except Exception as e:
            print(e)
            return False

    def store_data(self, current_user: str, patient: PatientData):
        print(patient)
        try:
            with Session(self.engine) as session:
                new_user_data = UserData(**patient)
                session.add(new_user_data)
                session.commit()
                session.close()
                return True
        except Exception as e:
            print(e)
            return False

    def get_summary(self, visitId: str):
        user_data = {}
        try:
            with Session(self.engine_evva) as session:
                # Assuming you want to fetchall records, adjust the query as needed
                user_data_list = select(VeteranData).where(VeteranData.patient_id == visitId)
                results = session.exec(user_data_list).first()
            
                user_data = results.result

                session.close()
        except Exception as e:
            print(e)

        return user_data
    
    def inform_login(self, username:str):
        try:
            # Get current timestamp
            current_time = datetime.now()

            # Format timestamp in year-month-date-hour-minute format
            formatted_time = current_time.strftime("%Y-%m-%d-%H-%M")
            new_user_login=InformLogin(username=username, timestamp=formatted_time)
            with Session(self.engine) as session:
                session.add(new_user_login)
                session.commit()
                session.close()
                return True

        except Exception as e:
            return False
        
    def save_detailed_data(self, visitId:str, prev):

        try:
            with Session(self.engine) as session:
                # Check if entry exists
                statement = select(UserData).where(UserData.visitId == visitId)
                results=session.exec(statement)
                update_result=results.first()
                update_result.prev=prev
                session.add(update_result)
                session.commit()
                session.refresh(update_result)
                # session.close()  # Ensure session is closed after committing changes
                session.close()
                return True
            
        except Exception as e:
            print(e)
            return False
     
    def update_transctiption(self, visitId:str, details, summary):
        # print(result)
      
        try:
            with Session(self.engine) as session:
                statement = select(UserData).where(UserData.visitId == visitId)
                result = session.exec(statement) 
                existing_result = result.first()
                updated_result=details
                existing_result.details=updated_result
                session.add(existing_result)
                session.commit()
                session.refresh(existing_result)
                session.close()

            with Session(self.engine_evva) as session:
                statement=select(VeteranData).where(VeteranData.patient_id==visitId)
                result=session.exec(statement)
                existing_result=result.first()
                updated_result=summary
                existing_result.result=updated_result
                
                print(updated_result)
                session.add(existing_result)
                session.commit()
                session.refresh(existing_result)
                session.close()
                return True

        except Exception as e:
            return False
        

