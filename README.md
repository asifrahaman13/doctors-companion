## A healthcare companion for doctors.

First clone the repository.

```
git clone https://github.com/asifrahaman13/healthcare-data.git
```

## Backend

Move to the backend directory
```
cd backend/
```

Next create and activate the virtual environment. 

```
virtualenv .venv
source .venv/bin/activate
```
Install the necessary packages and dependencies

```
pip install -r requirements.txt
```

Next change the .env.example to .env and  enter the information in the .env file.

Now run the backend 

```
uvicron main:app --reload
```

## AI Backend.

Next you need to run the AI backend.

```
cd AI_BACKEND/
virtualenv .venv
source .venv/bin/activate
```
Install the necessary packages and dependencies

```
pip install -r requirements.txt
```

Next change the .env.example to .env and  enter the information in the .env file.

Now run the backend 

```
uvicron main:app --reload
```

## Front end 

Open another terminal to move to the front end.

```
cd frontend/
```

Install the required packages

```
yarn install
```

Next run the development server

```
yarn run dev
```