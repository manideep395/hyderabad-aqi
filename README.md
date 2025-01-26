# Air Quality Index (AQI) Prediction System 🌍

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

## 🌟 Project Overview
An advanced web application that provides real-time Air Quality Index (AQI) monitoring and prediction using multiple AI/ML models. The system offers comprehensive data visualization and health recommendations based on environmental conditions.

## 🔴 Live Demo
Visit the [Live Demo](https://lovable.dev/projects/c44b79dd-abc3-4d19-a8f0-5b0ae531793c)

## 🎯 Key Features

### Real-time AQI Monitoring
- Live updates from multiple monitoring stations
- Comprehensive pollutant tracking (PM2.5, PM10, NO₂, O₃, etc.)
- Visual indicators and trend analysis
- Health recommendations based on AQI levels

### Prediction System
- Multiple AI/ML models for accurate forecasting
- Historical data analysis
- Seasonal trend predictions
- Custom trend percentage adjustments

### Data Visualization
- Interactive charts and graphs
- Comparative analysis tools
- Downloadable PDF reports
- Real-time weather condition displays

## 🏗️ Tech Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Tanstack Query** for data fetching
- **Recharts** for data visualization
- **Lucide React** for icons
- **jsPDF & html2canvas** for PDF generation

### AI/ML Models

#### 1. Linear Regression Model (v1.0)
- Basic AQI prediction using historical data
- Features: temperature, humidity, wind speed, rainfall
- Implementation: Custom mathematical formulas

#### 2. LSTM Model (v1.0)
- Time series prediction with 24-hour sequence length
- Normalized feature processing
- Handles temporal dependencies in environmental data

#### 3. Random Forest Model (v1.0)
- Feature importance analysis
- Multi-variable environmental prediction
- Confidence scoring system

#### 4. Transformer Model (v1.0)
- Based on HuggingFace transformers
- Uses distilbert-base-uncased model
- WebGPU acceleration for processing

#### 5. Deep Learning Model (v1.0)
- Neural network architecture: [Input(9) → Hidden(64,32,16) → Output(1)]
- Specialized for complex AQI predictions
- Feature engineering for environmental variables

## 📍 Monitoring Stations

### Hyderabad Locations
1. New Malakpet (Station ID: 14135)
2. Nacharam (Station ID: 14155)
3. ECIL (Station ID: 14156)
4. Hyderabad US Consulate (Station ID: 7022)
5. Bahadurpura Zoo Park (Station ID: 8677)
6. Somajiguda (Station ID: 14125)
7. Sanathnagar (Station ID: 8182)
8. Kokapet (Station ID: 14127)
9. Central University Hyderabad (Station ID: 11284)
10. Patancheruvu (Station ID: 11305)
11. IDA Pashamylaram (Station ID: 9144)
12. IITH Kandi (Station ID: 14126)
13. Kompally (Station ID: 14149)
14. Ramachandrapuram (Station ID: 14140)
15. Bollaram (Station ID: 11295)

## 🚀 Getting Started

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

## 🛠️ Usage

### 1. Location Selection
- Choose from available monitoring stations
- View real-time AQI data
- Access detailed station information

### 2. Prediction Configuration
- Select future date and time
- Adjust trend parameters
- Choose seasonal factors

### 3. Report Generation
- Generate detailed predictions
- Download PDF reports
- Share results with stakeholders

## 📊 Data Sources
- World Air Quality Index (WAQI) API for real-time data
- Historical environmental data for model training
- Weather data integration for comprehensive analysis

## 👨‍💻 Developer Information

### Lead Developer
- **Name**: Air Quality Monitoring Team
- **Organization**: Environmental Monitoring Division
- **Contact**: [Contact Support](mailto:support@example.com)

### Development Team
- AI/ML Model Development Team
- Frontend Development Team
- Data Analysis Team
- Quality Assurance Team

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- WAQI for providing real-time air quality data
- HuggingFace for transformer models
- shadcn/ui for component library
- Environmental agencies for data validation

## 📞 Support
For support, please email [support@example.com](mailto:support@example.com) or open an issue in the repository.

---
<div align="center">
  Made with ❤️ for a cleaner environment
</div>