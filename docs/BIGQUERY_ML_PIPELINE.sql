-- ==============================================================================================
-- 🌐 PulseBRICS: BigQuery ML Time-Series & Predictive Demand Forecasting Pipeline
-- Google Cloud Hackathon 2026 - Track 03: Smart Health & Supply Chain Resilience
-- ==============================================================================================

-- 1. Create Ingestion Dataset for Multi-District Healthcare Telemetry
CREATE SCHEMA IF NOT EXISTS `pulse_brics_analytics`
OPTIONS (
  location = 'asia-south1',
  description = 'Federated Health Supply Chain & Telemetry Dataset for BRICS Primary Clinics'
);

-- 2. Daily Clinic Inventory Consumption & Meteorological Telemetry Table
CREATE OR REPLACE TABLE `pulse_brics_analytics.phc_daily_consumption` (
  phc_id STRING,
  country_code STRING,
  district STRING,
  medicine_id STRING,
  medicine_name STRING,
  timestamp DATE,
  daily_consumed_units INT64,
  stock_on_hand INT64,
  monsoon_rainfall_mm FLOAT64,
  flood_risk_index FLOAT64,
  temperature_celsius FLOAT64,
  outbreak_vector_score FLOAT64
);

-- 3. Train Vertex AI / BigQuery ML Time-Series ARIMA_PLUS Forecasting Model
-- Automatically captures holiday seasonality, monsoon spikes, and outbreak accelerations
CREATE OR REPLACE MODEL `pulse_brics_analytics.demand_forecaster_arima_plus`
OPTIONS (
  model_type = 'ARIMA_PLUS',
  time_series_timestamp_col = 'timestamp',
  time_series_data_col = 'daily_consumed_units',
  time_series_id_col = ['phc_id', 'medicine_id'],
  holiday_region = 'IN',
  clean_spikes_and_dips = TRUE,
  decompose_time_series = TRUE,
  auto_arima = TRUE,
  data_frequency = 'DAILY'
) AS
SELECT
  phc_id,
  medicine_id,
  timestamp,
  daily_consumed_units
FROM
  `pulse_brics_analytics.phc_daily_consumption`
WHERE
  timestamp >= DATE_SUB(CURRENT_DATE(), INTERVAL 180 DAY);

-- 4. 30-Day Forward Predictive Stockout Vulnerability Query
-- Joins forecasted demand with current stock levels to detect clinics at risk of stockout
CREATE OR REPLACE TABLE `pulse_brics_analytics.forecast_stockout_vulnerability_30d` AS
WITH forecast_data AS (
  SELECT
    phc_id,
    medicine_id,
    forecast_timestamp,
    forecast_value,
    confidence_interval_lower_bound AS ci_lower_95,
    confidence_interval_upper_bound AS ci_upper_95
  FROM
    ML.FORECAST(
      MODEL `pulse_brics_analytics.demand_forecaster_arima_plus`,
      STRUCT(30 AS horizon, 0.95 AS confidence_level)
    )
),
aggregated_forecast AS (
  SELECT
    phc_id,
    medicine_id,
    SUM(forecast_value) AS projected_30d_burn,
    SUM(ci_upper_95) AS projected_30d_burn_worst_case
  FROM
    forecast_data
  GROUP BY
    phc_id, medicine_id
),
current_inventory AS (
  SELECT
    phc_id,
    medicine_id,
    stock_on_hand,
    monsoon_rainfall_mm,
    outbreak_vector_score
  FROM
    `pulse_brics_analytics.phc_daily_consumption`
  WHERE
    timestamp = CURRENT_DATE()
)
SELECT
  inv.phc_id,
  inv.medicine_id,
  inv.stock_on_hand,
  ROUND(fc.projected_30d_burn, 1) AS projected_30d_demand,
  ROUND(fc.projected_30d_burn_worst_case, 1) AS projected_worst_case_demand,
  CASE
    WHEN inv.stock_on_hand < (fc.projected_30d_burn * 0.3) THEN 'CRITICAL_STOCKOUT_IMMINENT'
    WHEN inv.stock_on_hand < fc.projected_30d_burn THEN 'VULNERABLE_SURGE_DEFICIT'
    WHEN inv.stock_on_hand > (fc.projected_30d_burn * 2.5) THEN 'SURPLUS_DONOR_CANDIDATE'
    ELSE 'NOMINAL_SAFE'
  END AS supply_resilience_status,
  ROUND(
    GREATEST(0, LEAST(100, 
      (1.0 - (SAFE_DIVIDE(inv.stock_on_hand, fc.projected_30d_burn))) * 100 
      + (inv.outbreak_vector_score * 20)
    )), 1
  ) AS stockout_vulnerability_score
FROM
  current_inventory inv
JOIN
  aggregated_forecast fc
ON
  inv.phc_id = fc.phc_id AND inv.medicine_id = fc.medicine_id;

-- 5. Autonomous Rebalancing Trigger View (Feed for Gemini Logistics Agent)
CREATE OR REPLACE VIEW `pulse_brics_analytics.autonomous_rebalance_trigger_feed` AS
SELECT
  deficit.phc_id AS recipient_phc_id,
  donor.phc_id AS donor_phc_id,
  deficit.medicine_id,
  deficit.stock_on_hand AS current_deficit_stock,
  donor.stock_on_hand AS donor_surplus_stock,
  (donor.stock_on_hand - donor.projected_30d_demand) AS available_transfer_units
FROM
  `pulse_brics_analytics.forecast_stockout_vulnerability_30d` deficit
CROSS JOIN
  `pulse_brics_analytics.forecast_stockout_vulnerability_30d` donor
WHERE
  deficit.supply_resilience_status IN ('CRITICAL_STOCKOUT_IMMINENT', 'VULNERABLE_SURGE_DEFICIT')
  AND donor.supply_resilience_status = 'SURPLUS_DONOR_CANDIDATE'
  AND deficit.medicine_id = donor.medicine_id;
