import json
import os
import sys
import requests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from config.config import BASE_URL

def test_get_patients():
    reqUrl = f"{BASE_URL}/users/get-patient"
    headersList = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YSIsImV4cCI6MTcwNzg4ODkzNX0.w2_I5wlej46EM81GmR3jIWa8UArjMAcdZ-gspDlwVDA",
        "Content-Type": "application/json",
    }
    payload = json.dumps(
        {
            "patient_id": "d56cd77d",
            "detail": "Third sample test details",
            "memberpass": "vapass",
            "membername": "va",
        }
    )
    response = requests.request("POST", reqUrl, data=payload, headers=headersList)
    assert response.status_code == 200
    assert response.json() == {
        "user_id": "va",
        "details": [
            "The neurologist you'll be seeing today, How are you feeling? Good morning, Doctor Smith. I've been better. These headaches have really been affecting my daily life.",
            "I understand and I'm sorry to hear that. Let's talk about your symptoms in detail. Can you describe these headaches for me?",
            "They've been happening for about 6 months now. They're really severe. Sometimes I can barely function. They're throbbing, usually on one side of my head and last for hours. I see. Do you notice anything that seems to trigger them?",
            "Stress mostly my job as a teacher and managing family affairs. Especially with my husband being a veteran, it can get quite overwhelming.",
            "My husband being a veteran, it can get quite overwhelming. Do you experience any other symptoms with the headaches, like sensitivity to light or sound?",
            "Yes, both. I often have to lie down in a dark and quiet room. Sometimes there's nausea too, but no vomiting.",
            "And have you noticed any changes in your headache pattern recently?",
            "Not really in the pattern, but they've been getting more frequent and intense.",
            "I see. Let's go over your medical history. You've had migraines since your late 20s, correct?",
            "Yes, that's right. No.",
            "Any significant medical or surgical history we should know about?",
            "Oh, nothing apart from the migraines. And you said your current medications are ibuprofen and multivitamins.",
            "Yes, I take ibuprofen when the headache starts.",
            "Great. Thank you for that information. I'll perform a neurological exam now.",
        ],
        "patient_name": "Adam Smith",
        "patient_id": "d56cd77d",
        "id": 15,
        "date": "2024-02-06",
    }

def test_get_summary():
    reqUrl = f"{BASE_URL}/users/get-summary"
    headersList = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2YSIsImV4cCI6MTcwNzg4ODkzNX0.w2_I5wlej46EM81GmR3jIWa8UArjMAcdZ-gspDlwVDA",
        "Content-Type": "application/json",
    }

    payload = json.dumps(
        {
            "patient_id": "d56cd77d",
            "detail": "Third sample test details",
            "memberpass": "vapass",
            "membername": "va",
        }
    )
    response = requests.request("POST", reqUrl, data=payload, headers=headersList)
    assert response.status_code == 200
    assert response.json() == {
        "Plan": {
            "FollowUp": "Agendar um retorno em 4 a 6 semanas para avaliar a resposta ao tratamento e considerar encaminhamento para um especialista em dores de cabeça, se necessário.",
            "TreatmentPlan": {
                "Pharmacotherapy": "Iniciar um medicamento preventivo chamado Topiramato. Tentar um triptano, como o sumatriptano, como opção de tratamento agudo em substituição ou em adição ao ibuprofeno.",
                "PatientEducation": "Receber material educacional sobre enxaquecas para entender melhor a condição e saber quando procurar atendimento médico adicional.",
                "OtherTherapeuticProcedures": "Fazer mudanças no estilo de vida, como ter um sono regular, manter-se hidratado, gerenciar o estresse e identificar gatilhos alimentares. Manter um diário de dores de cabeça para acompanhar os sintomas e possíveis gatilhos.",
            },
            "DiagnosticPlan": "Realizar exames de sangue completos, incluindo contagem de células sanguíneas e taxa de sedimentação de eritrócitos. Realizar testes de função da tireoide. Realizar uma ressonância magnética cerebral para procurar anomalias estruturais.",
        },
        "summary": "Mrs. Nguyen has been having severe headaches for 6 months. The doctor thinks they might be migraines and wants to do tests to be sure. Treatment options include medication and lifestyle changes. Mrs. Nguyen will have a follow-up appointment in 4-6 weeks.",
        "Objective": {
            "LabData": "",
            "VitalSigns": {
                "HeartRate": "",
                "Temperature": "",
                "BloodPressure": "",
                "RespiratoryRate": "",
                "OxygenSaturation": "",
            },
            "PhysicalExam": "",
        },
        "Assessment": {
            "ProblemList": [
                {
                    "ProblemNumber": 1,
                    "ProblemDescription": "Headaches: The headaches have been happening for about 6 months. They are severe and throbbing, usually on one side of the head. They last for hours and sometimes the patient can barely function.",
                },
                {
                    "ProblemNumber": 2,
                    "ProblemDescription": "Sensitivity to light and sound: The patient experiences sensitivity to light and sound during the headaches and often needs to lie down in a dark and quiet room.",
                },
                {
                    "ProblemNumber": 3,
                    "ProblemDescription": "Nausea: The patient sometimes experiences nausea with the headaches, but there is no vomiting.",
                },
            ],
            "AssessmentDescription": "The doctor's diagnosis for the patient is that her symptoms are consistent with migraines.",
            "DifferentialDiagnoses": [],
        },
        "Subjective": {
            "HPI": "The patient, Missus Nguyen, has been experiencing severe headaches for about 6 months. These headaches are throbbing and usually occur on one side of her head. They last for hours and sometimes she can barely function. Missus Nguyen mentioned that stress is the main trigger for her headaches, as her job as a teacher and managing family affairs can be overwhelming. She also experiences sensitivity to light and sound, and often needs to lie down in a dark and quiet room. Occasionally, she experiences nausea but no vomiting. The frequency and intensity of the headaches have been increasing lately.",
            "ReviewOfSystems": "There is no mention of the patient's family history or social history in the transcription.",
            "CurrentMedications": [
                {"Dosage": "not mentioned", "MedicationName": "Ibuprofen"},
                {"Dosage": "not mentioned", "MedicationName": "multivitamins"},
            ],
            "PertinentPastMedicalHistory": "Missus Nguyen has a history of migraines since her late twenties.",
        },
    }
