# Evva Backend

## Project Folder Structure

```
.
├── config
│   ├── config.py
│   └── __pycache__
│       └── config.cpython-310.pyc
├── Dockerfile
├── README.md
├── requirements.txt
├── src
│   ├── application
│   │   ├── cli
│   │   └── web
│   ├── domain
│   │   ├── entities
│   │   ├── interfaces
│   │   └── use_cases
│   ├── infastructure
│   │   ├── exceptions
│   │   ├── repositories
│   │   └── services
│   ├── main.py
│   └── __pycache__
│       └── main.cpython-310.pyc
└── tests
    └── test.py
```

## How to run the code

First clone the repository.

```
git clone https://github.com/pollvaulting/evva-frontend.git
```

## Backend
Open the backend in a terminal.

```
cd backend/
```

Create virtual environment and install the dependencies.

```
virtualenv .venv
```

Activate the virtual environment

```
source .venv/bin/activate
```

Install dependencies.

```
pip install -r requirements.txt
```

Run the backend in port 8000

```
uvicorn src.main:app --reload
```

