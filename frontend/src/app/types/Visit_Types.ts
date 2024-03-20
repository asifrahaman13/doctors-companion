export interface HistoryItem {
  mrn: string;
  visitId: string;
  date: string;
  name: string;
  uniqueId: string;
  dob: string;
  gender: string;
  id: string;
  patient_id: string;
  patient_name: string;
  details: string[]; // Changed to match the type in the interface
}