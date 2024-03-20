import requests
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from config.config import BASE_URL


def test_the_server_status():
    response = requests.get(BASE_URL + "/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
