# Zadaci API (Node.js / Express)

## Pokretanje lokalno
    npm install
    npm run dev

API radi na http://localhost:3000

## Endpointi
| Metoda | Putanja | Opis |
|---|---|---|
| GET | / | Osnovne informacije |
| GET | /health | Provjera da servis radi |
| GET | /tasks | Svi zadaci (opcionalno ?done=true/false) |
| GET | /tasks/:id | Jedan zadatak |
| POST | /tasks | Novi zadatak: {"title": "..."} |
| PUT | /tasks/:id | Izmjena zadatka |
| DELETE | /tasks/:id | Brisanje zadatka |
