# Air Quality Index (AQI) Prediction System

## Project Overview
An advanced web application that predicts and analyzes Air Quality Index (AQI) using multiple AI/ML models, providing real-time data visualization and health recommendations based on environmental conditions.

## Live Demo
Visit the [Live Demo](https://lovable.dev/projects/c44b79dd-abc3-4d19-a8f0-5b0ae531793c)

## Tech Stack

### Frontend
- React 18.3.1 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui for UI components
- Tanstack Query for data fetching
- Recharts for data visualization
- Lucide React for icons
- jsPDF & html2canvas for PDF generation

### AI/ML Models

1. **Linear Regression Model (v1.0)**
   - Basic AQI prediction using historical data
   - Features: temperature, humidity, wind speed, rainfall
   - Implementation: Custom mathematical formulas

2. **LSTM Model (v1.0)**
   - Time series prediction with 24-hour sequence length
   - Normalized feature processing
   - Handles temporal dependencies in environmental data

3. **Random Forest Model (v1.0)**
   - Feature importance analysis
   - Multi-variable environmental prediction
   - Confidence scoring system

4. **Transformer Model (v1.0)**
   - Based on HuggingFace transformers
   - Uses distilbert-base-uncased model
   - WebGPU acceleration for processing

5. **Deep Learning Model (v1.0)**
   - Neural network architecture: [Input(9) → Hidden(64,32,16) → Output(1)]
   - Specialized for complex AQI predictions
   - Feature engineering for environmental variables

### API Integrations
- WAQI (World Air Quality Index) API for real-time data

## Features

### 1. AQI Prediction
- Location-based air quality forecasting
- Time and date-specific predictions
- Seasonal trend analysis
- Custom trend percentage adjustments

### 2. Weather Analysis
- Temperature modeling and prediction
- Humidity level forecasting
- Wind speed calculations
- Rainfall probability estimation

### 3. Health Recommendations
- Real-time health status based on AQI
- Preventive measures and guidelines
- Environmental impact analysis
- Cause identification and solutions

### 4. Data Visualization
- Interactive charts and graphs
- Current vs Predicted value comparisons
- Weather condition displays
- Downloadable PDF reports

## Calculation Methods

### Temperature Calculation
```typescript
temperature = baseTemp + amplitude * Math.sin(((hour - peakHour) * Math.PI) / 12)
```

### AQI Prediction
```typescript
predictedAQI = currentAQI * (1 + (yearDifference / 12)) * seasonalFactor
```

### Trend Adjustments
```typescript
if (trend === "increase") {
  predictedAQI *= (1 + (trendPercentage / 100))
} else if (trend === "decrease") {
  predictedAQI *= (1 - (trendPercentage / 100))
}
```

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Usage

1. **Location Selection**
   - Choose from available monitoring stations
   - View real-time AQI data

2. **Prediction Configuration**
   - Select future date and time
   - Adjust trend parameters
   - Choose seasonal factors

3. **Report Generation**
   - View detailed predictions
   - Download PDF reports
   - Share results

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- WAQI for providing real-time air quality data
- HuggingFace for transformer models
- shadcn/ui for component library