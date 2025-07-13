# Healthtech Directory

A comprehensive healthcare provider directory application with interactive maps and detailed provider information.

## 🏥 Features

- **Hospital/Clinic Search**: Browse healthcare facilities with detailed information
- **Location Mapping**: Interactive maps showing exact locations with coordinates
- **Procedure Listings**: Detailed procedure offerings with pricing information
- **Provider Profiles**: Healthcare provider information with specialties and experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data**: Live data from MongoDB database

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your MongoDB connection string and other settings.

4. **Import sample data** (optional):
   ```bash
   python import_data.py
   ```

5. **Start the backend server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your API endpoints and other settings.

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/healthtech_db
DB_NAME=healthtech_db
PORT=8000
HOST=localhost
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
SECRET_KEY=your-secret-key
```

#### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_APP_NAME=Healthtech Directory
REACT_APP_DEFAULT_MAP_CENTER_LAT=13.7563
REACT_APP_DEFAULT_MAP_CENTER_LNG=100.5018
REACT_APP_DEFAULT_MAP_ZOOM=12
```

## 📊 Database Structure

### Collections

1. **ClinicsHospitals**: Healthcare facility information
2. **Locations**: Physical locations with coordinates
3. **ProcedureOfferings**: Available procedures with pricing
4. **Providers**: Healthcare provider profiles

### Data Import

The project includes sample data in JSON format. To import:

```bash
cd backend
python import_data.py
```

## 🛠️ API Endpoints

- `GET /clinics-hospitals` - List all healthcare facilities
- `GET /locations?clinicId={id}` - Get locations for a clinic
- `GET /procedure-offerings?clinicId={id}&locationId={id}` - Get procedures
- `GET /providers?ids={comma-separated-ids}` - Get provider details

## 🎨 UI Features

- **Material-UI Design**: Modern, responsive interface
- **Interactive Maps**: Leaflet maps with custom markers
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Graceful error messages and fallbacks
- **Null Data Handling**: Smart handling of missing or incomplete data
- **Responsive Layout**: Optimized for all screen sizes

## 🔒 Security

- Environment variables for sensitive data
- CORS configuration
- Input validation
- Error handling without data exposure

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen orientations

## 🧪 Development

### Code Structure

```
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── import_data.py       # Data import script
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── config/         # Configuration files
│   │   └── index.js        # React entry point
│   └── package.json        # Node.js dependencies
└── excel_sheets_data/      # Sample data files
```

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Create new components in `src/components/`
3. **Database**: Update models in `models.py`
4. **Configuration**: Add environment variables as needed

## 🐛 Troubleshooting

### Common Issues

1. **Map not displaying**: Check coordinates in database
2. **API connection failed**: Verify backend is running on correct port
3. **Data not loading**: Check MongoDB connection string
4. **CORS errors**: Verify CORS_ORIGINS in backend .env

### Debug Mode

Enable debug mode by setting:
```env
REACT_APP_ENABLE_DEBUG=true
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@healthtech.com or create an issue in the repository.

## 🔄 Updates

Check the repository regularly for updates and new features.