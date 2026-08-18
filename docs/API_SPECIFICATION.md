# PulseBRICS — API Specifications

Base URL: `/api`

---

## 1. System Health
### `GET /api/health`
Returns service uptime and Gemini client status.

**Response:**
```json
{
  "status": "HEALTHY",
  "service": "PulseBRICS API Core",
  "version": "1.0.0",
  "geminiEnabled": true,
  "timestamp": "2026-08-18T00:00:00.000Z"
}
```

---

## 2. Primary Health Care (PHC) & Inventory
### `GET /api/phc`
Retrieves all primary health care facilities filtered by country or district.

**Query Parameters:**
- `country`: `IN` | `BR` | `ZA` (optional)
- `district`: string (optional)

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "PHC-IN-001",
      "country": "IN",
      "name": "Shirol Primary Health Centre",
      "district": "Kolhapur",
      "state": "Maharashtra",
      "lat": 16.7384,
      "lng": 74.5976,
      "resilienceScore": 42,
      "riskStatus": "CRITICAL_SURGE",
      "coldChainStatus": "STABLE (4.2°C)",
      "inventory": [ ... ]
    }
  ]
}
```

### `POST /api/phc/:id/inventory-update`
Updates drug counts and staff attendance for a PHC.

**Request Body:**
```json
{
  "updates": [
    { "medicineId": "MED-01", "currentStock": 12, "consumedToday": 4 }
  ],
  "doctorAttendance": "2/2 Present",
  "nurseAttendance": "4/4 Present"
}
```

---

## 3. Gemini Multimodal AI Engine
### `POST /api/ai/voice-parse`
Parses unstructured multilingual audio/transcript into structured inventory records.

**Request Body:**
```json
{
  "transcript": "आज 4 वाइल एंटी-वेनम और 35 ओआरएस पैकेट बचे हैं।",
  "language": "Hindi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "detectedLanguage": "Hindi",
    "extractedUpdates": [
      {
        "medicineId": "MED-01",
        "medicineName": "Polyvalent Snake Anti-Venom",
        "currentStock": 4,
        "consumedToday": 3,
        "unit": "Vials",
        "urgency": "CRITICAL_STOCKOUT"
      }
    ],
    "aiSummary": "Parsed 2 inventory updates with 98.4% confidence."
  }
}
```

### `POST /api/ai/vision-scan`
Performs OCR on medicine shelf or handwritten ledger images using Gemini 2.0 Vision.

**Request Body:**
```json
{
  "imageBase64": "<base64_string>",
  "mimeType": "image/jpeg"
}
```

---

## 4. Predictive Analytics & Crisis Simulation
### `GET /api/predict/forecast`
Generates 30-day time series demand projections with 95% confidence intervals.

**Query Parameters:**
- `phcId`: string (e.g. `PHC-IN-001`)
- `medicineId`: string (e.g. `MED-01`)
- `surgeMultiplier`: float (default `1.0`)

### `POST /api/predict/simulate-crisis`
Injects real-time crisis scenarios (Monsoon Floods, Dengue Surges, Power Outages).

**Request Body:**
```json
{
  "crisisType": "MONSOON_FLOOD",
  "country": "IN",
  "district": "Kolhapur"
}
```

---

## 5. Autonomous Rebalance & Logistics
### `POST /api/agent/rebalance/find-match`
Finds optimal donor candidate and generates Gemini explainable dispatch manifest.

**Request Body:**
```json
{
  "recipientPhcId": "PHC-IN-001",
  "medicineId": "MED-01",
  "deficitQuantity": 24
}
```

### `POST /api/agent/dispatch`
Authorizes an active transfer and registers it in the fleet tracker.

### `GET /api/agent/dispatches`
Returns all active in-transit deliveries with cold-chain telemetry.
