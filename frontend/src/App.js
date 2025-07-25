import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG, { MAP_CONFIG, APP_CONFIG } from './config/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Paper, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
  Autocomplete,
  TextField,
  ListItemIcon
} from '@mui/material';
import {
  Room as RoomIcon,
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  LocalPharmacy as MedicalIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Work as WorkIcon,
  School as SchoolIcon
} from '@mui/icons-material';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_BASE = API_CONFIG.BASE_URL;

// Enhanced DetailCard component with better styling and null handling
function DetailCard({ title, data, icon: Icon, color = 'primary' }) {
  if (!data) return null;

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <Typography variant="body2" color="text.secondary" fontStyle="italic">Not available</Typography>;
    }
    if (typeof value === 'object') {
      return <Typography variant="body2">{JSON.stringify(value, null, 2)}</Typography>;
    }
    return <Typography variant="body2">{String(value)}</Typography>;
  };

  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

  return (
    <Card sx={{ 
      mb: 2, 
      boxShadow: 3, 
      borderRadius: 2,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 6
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {Icon && (
            <Avatar sx={{ bgcolor: `${color}.main`, mr: 2, width: 40, height: 40 }}>
              <Icon />
            </Avatar>
          )}
          <Typography variant="h6" component="h2" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List dense>
          {Object.entries(data)
            .filter(([key]) => !key.startsWith('_'))
            .map(([key, value]) => (
              <ListItem key={key} disablePadding sx={{ mb: 1 }}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="medium" color="text.primary">
                      {formatKey(key)}
                    </Typography>
                  }
                  secondary={formatValue(value)}
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
}

// Loading skeleton component
function LoadingSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="text" width="40%" height={32} />
            </Box>
            <Skeleton variant="rectangular" height={100} />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

// Enhanced procedure card with pricing and provider info
function ProcedureCard({ procedure, providers, onSelect, isSelected }) {
  // Helper to show value or fallback
  const showValue = (val) => (val !== undefined && val !== null && val !== '' && val !== 'null' ? val : <span style={{color:'#888',fontStyle:'italic'}}>Not available</span>);

  // Only user-friendly fields (no IDs)
  const fields = [
    { label: 'Procedure Name (EN)', key: 'Raw Name (EN)' },
    { label: 'Procedure Name (TH)', key: 'Raw Name (TH)' },
    { label: 'Price Min (THB)', key: 'Price Min' },
    { label: 'Price Max (THB)', key: 'Price Max' },
    { label: 'Price Min (USD)', key: 'Price Min $$' },
    { label: 'Price Max (USD)', key: 'Price Max $$' },
    { label: 'Language(s)', key: 'Language U' },
    { label: 'Source URL', key: 'Source URL', isUrl: true },
    { label: 'Auto Filled', key: 'Auto Filled' },
    { label: 'Confidence', key: 'Confidence' },
    { label: 'Procedure Note', key: 'Procedure Note' },
    { label: 'Last Update', key: 'Last Update' },
  ];

  const hasPrice = procedure['Price Min'] || procedure['Price Max'] || procedure['Price Min $$'] || procedure['Price Max $$'];

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-1px)',
          boxShadow: 4
        }
      }}
      onClick={() => onSelect(procedure)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" fontWeight="bold" flex={1}>
            {procedure['Raw Name (EN)'] || procedure['Raw Name (TH)'] || 'Unknown Procedure'}
          </Typography>
          {hasPrice && (
            <Chip 
              icon={<MoneyIcon />} 
              label="Priced" 
              color="success" 
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        <Box component="dl" sx={{ m: 0, mb: 2 }}>
          {fields.map(({ label, key, isUrl }) => (
            <Box key={key} display="flex" alignItems="center" mb={0.5}>
              <Typography component="dt" variant="subtitle2" sx={{ minWidth: 120, fontWeight: 500 }}>
                {label}:
              </Typography>
              <Typography component="dd" variant="body2" sx={{ ml: 1, wordBreak: 'break-all' }}>
                {isUrl && procedure[key] ? (
                  <a href={procedure[key]} target="_blank" rel="noopener noreferrer">{procedure[key]}</a>
                ) : showValue(procedure[key])}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Chip 
            icon={<MedicalIcon />} 
            label={procedure['Raw Name (EN)'] || procedure['Raw Name (TH)'] || 'Procedure'} 
            variant="outlined" 
            size="small"
          />
          {providers && providers.length > 0 && (
            <Chip 
              icon={<PersonIcon />} 
              label={`${providers.length} Provider${providers.length > 1 ? 's' : ''}`} 
              color="info" 
              size="small"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function LocationCard({ location }) {
  if (!location) return null;
  // Main fields to show with icons
  const mainFields = [
    { key: 'Address', label: 'Address', icon: <RoomIcon color="secondary" /> },
    { key: 'Hours', label: 'Hours', icon: <TimeIcon color="action" /> },
    { key: 'Phone', label: 'Phone', icon: <PhoneIcon color="action" /> },
    { key: 'Website', label: 'Website', icon: <WebsiteIcon color="action" /> },
  ];
  // Fields to skip (already shown or internal IDs)
  const skipKeys = [
    'Address', 'Hours', 'Phone', 'Website',
    'Clinic ID', 'Location ID', '_id', '__v', 'clinicId', 'clinic_id', '_clinicId',
    'Branch Name', 'Location Name'
  ];
  // All other fields
  const extraFields = Object.entries(location)
    .filter(([key, value]) => !skipKeys.includes(key) && value && value !== 'null' && value !== '')
    .map(([key, value]) => ({ key, value }));
  return (
    <Card sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 40, height: 40 }}>
            <RoomIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {location['Branch Name'] || location['Address'] || location['Location ID'] || 'Location Details'}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List dense>
          {mainFields.map(({ key, label, icon }) => (
            <ListItem disablePadding sx={{ mb: 1 }} key={key}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight="medium">{label}</Typography>}
                secondary={
                  key === 'Website' && location[key] ? (
                    <a href={location[key]} target="_blank" rel="noopener noreferrer">{location[key]}</a>
                  ) : location[key] ? location[key] : <span style={{color:'#888',fontStyle:'italic'}}>Not available</span>
                }
              />
            </ListItem>
          ))}
          {/* Extra fields */}
          {extraFields.length > 0 && <Divider sx={{ my: 1 }} />}
          {extraFields.map(({ key, value }) => (
            <ListItem disablePadding sx={{ mb: 1 }} key={key}>
              <ListItemText
                primary={<Typography variant="subtitle2" fontWeight="medium">{key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/\b\w/g, l => l.toUpperCase()).trim()}</Typography>}
                secondary={<Typography variant="body2">{value}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

function App() {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [clinicDetails, setClinicDetails] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationDetails, setLocationDetails] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [providers, setProviders] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    clinics: true,
    locations: false,
    procedures: false,
    providers: false
  });
  
  // Error states
  const [errors, setErrors] = useState({});

  // Helper function to handle API calls with error handling
  const handleApiCall = async (apiCall, loadingKey, errorKey) => {
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      setErrors(prev => ({ ...prev, [errorKey]: null }));
      const result = await apiCall();
      return result;
    } catch (error) {
      console.error(`Error in ${errorKey}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [errorKey]: error.response?.data?.message || error.message || 'An error occurred' 
      }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Load clinics on component mount
  useEffect(() => {
    handleApiCall(
      () => axios.get(`${API_BASE}/clinics-hospitals`).then(res => { console.log('Clinics API response:', res); return res; }),
      'clinics',
      'clinics'
    ).then(response => {
      if (response?.data) {
        setClinics(response.data);
      } else {
        console.log('No clinics data received:', response);
      }
    });
  }, []);

  // Handle clinic selection
  useEffect(() => {
    if (selectedClinic) {
      const found = clinics.find(c => 
        (c['Clinic ID'] && c['Clinic ID'] === selectedClinic) || 
        (c._id && c._id === selectedClinic)
      );
      setClinicDetails(found || null);
    } else {
      setClinicDetails(null);
    }
  }, [selectedClinic, clinics]);

  // Load locations when clinic is selected
  useEffect(() => {
    if (selectedClinic) {
      handleApiCall(
        () => axios.get(`${API_BASE}/locations`, { params: { clinicId: selectedClinic } }).then(res => { console.log('Locations API response:', res); return res; }),
        'locations',
        'locations'
      ).then(response => {
        if (response?.data) {
          setLocations(response.data);
        } else {
          console.log('No locations data received:', response);
        }
        // Reset dependent states
        setSelectedLocation('');
        setProcedures([]);
        setSelectedProcedure(null);
        setProviders([]);
      });
    } else {
      setLocations([]);
      setSelectedLocation('');
      setProcedures([]);
      setSelectedProcedure(null);
      setProviders([]);
    }
  }, [selectedClinic]);

  // Handle location selection
  useEffect(() => {
    if (selectedLocation) {
      // Always find the location object by Location ID
      const found = locations.find(l => l['Location ID'] === selectedLocation);
      setLocationDetails(found || null);
    } else {
      setLocationDetails(null);
    }
  }, [selectedLocation, locations]);

  // Load procedures when location is selected
  useEffect(() => {
    if (selectedClinic && selectedLocation) {
      handleApiCall(
        () => axios.get(`${API_BASE}/procedure-offerings`, {
          params: { clinicId: selectedClinic, locationId: selectedLocation }
        }).then(res => { console.log('Procedures API response:', res); return res; }),
        'procedures',
        'procedures'
      ).then(response => {
        if (response?.data) {
          setProcedures(response.data);
        } else {
          console.log('No procedures data received:', response);
        }
        setSelectedProcedure(null);
        setProviders([]);
      });
    } else {
      setProcedures([]);
      setSelectedProcedure(null);
      setProviders([]);
    }
  }, [selectedClinic, selectedLocation]);

  // Load providers when procedure is selected
  useEffect(() => {
    if (selectedProcedure && selectedProcedure['Provider ID']) {
      const providerIds = selectedProcedure['Provider ID'];
      let ids = '';
      
      if (Array.isArray(providerIds)) {
        ids = providerIds.join(',');
      } else if (typeof providerIds === 'string') {
        ids = providerIds.split(',').map(id => id.trim()).filter(id => id).join(',');
      }
      
      if (ids) {
        handleApiCall(
          () => axios.get(`${API_BASE}/providers`, { params: { ids } }).then(res => { console.log('Providers API response:', res); return res; }),
          'providers',
          'providers'
        ).then(response => {
          if (response?.data) {
            setProviders(response.data);
          } else {
            console.log('No providers data received:', response);
          }
        });
      }
    } else {
      setProviders([]);
    }
  }, [selectedProcedure]);

  // Enhanced function to get lat/lng with better error handling
  function getLatLng(location) {
    if (!location) return null;
    
    let lat = location['Latitude'] || location['latitude'] || location['lat'];
    let lng = location['Longitude'] || location['longitude'] || location['lng'];
    
    // Convert strings to numbers
    if (typeof lat === 'string') lat = parseFloat(lat);
    if (typeof lng === 'string') lng = parseFloat(lng);
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    
    return [lat, lng];
  }

  // Get display name for clinic
  const getClinicDisplayName = (clinic) => {
    return clinic['Clinic Name (EN)'] || clinic['Clinic Name (TH)'] || clinic['Clinic ID'] || 'Unknown Clinic';
  };

  // Get display name for location
  const getLocationDisplayName = (location) => {
    return location['Branch Name'] || location['Address'] || location['Location ID'] || 'Unknown Location';
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Toolbar>
          <HospitalIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {APP_CONFIG.NAME}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Find Healthcare Providers
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        {/* Selection Controls */}
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
            Search Healthcare Providers
          </Typography>
          <Grid container columns={12} spacing={3}>
            <Grid gridColumn="span 6">
              <Autocomplete
                options={clinics}
                getOptionLabel={option => getClinicDisplayName(option)}
                value={clinics.find(c => (c['Clinic ID'] && c['Clinic ID'] === selectedClinic) || (c._id && c._id === selectedClinic)) || null}
                onChange={(e, newValue) => setSelectedClinic(newValue ? (newValue['Clinic ID'] || newValue._id) : '')}
                loading={loading.clinics}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Select Hospital/Clinic"
                    placeholder="Type to search..."
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ style: { fontWeight: 'bold', color: '#1976d2' } }}
                  />
                )}
                isOptionEqualToValue={(option, value) => (option['Clinic ID'] || option._id) === (value['Clinic ID'] || value._id)}
                sx={{ minWidth: 280, mb: 1 }}
              />
              {loading.clinics && <CircularProgress size={20} sx={{ mt: 1 }} />}
              {errors.clinics && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.clinics}
                </Alert>
              )}
            </Grid>

            {locations.length > 0 && (
              <Grid gridColumn="span 6">
                <Autocomplete
                  options={locations.filter(l => {
                    // Match by Clinic ID or _id
                    const clinicId = selectedClinic;
                    return (
                      (l['Clinic ID'] && l['Clinic ID'] === clinicId) ||
                      (l.clinicId && l.clinicId === clinicId) ||
                      (l.clinic_id && l.clinic_id === clinicId) ||
                      (l._clinicId && l._clinicId === clinicId)
                    );
                  })}
                  getOptionLabel={option => getLocationDisplayName(option)}
                  value={locations.find(l => l['Location ID'] === selectedLocation) || null}
                  onChange={(e, newValue) => setSelectedLocation(newValue ? newValue['Location ID'] : '')}
                  loading={loading.locations}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select Branch"
                      placeholder="Type to search..."
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ style: { fontWeight: 'bold', color: '#1976d2' } }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option['Location ID'] === value['Location ID']}
                  sx={{ minWidth: 280, mb: 1 }}
                />
                {loading.locations && <CircularProgress size={20} sx={{ mt: 1 }} />}
                {errors.locations && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.locations}
                  </Alert>
                )}
              </Grid>
            )}
          </Grid>
        </Paper>

        <Grid container spacing={4} columns={12}>
          {/* Left Column - Details */}
          <Grid gridColumn="span 6">
            {/* Clinic Details */}
            {loading.clinics ? (
              <LoadingSkeleton />
            ) : clinicDetails ? (
              <DetailCard 
                title={getClinicDisplayName(clinicDetails)} 
                data={clinicDetails} 
                icon={HospitalIcon}
                color="primary"
              />
            ) : selectedClinic && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No clinic details available
              </Alert>
            )}

            {/* Location Details */}
            {loading.locations ? (
              <LoadingSkeleton />
            ) : locationDetails ? (
              <>
                <LocationCard location={locationDetails} />
                {/* Map always shown with location info */}
                {getLatLng(locationDetails) ? (
                  <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden' }}>
                        <MapContainer
                          center={getLatLng(locationDetails)}
                          zoom={MAP_CONFIG.DEFAULT_ZOOM + 4}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer
                            url={MAP_CONFIG.TILE_LAYER}
                            attribution={MAP_CONFIG.ATTRIBUTION}
                          />
                          <Marker position={getLatLng(locationDetails)}>
                            <Popup>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {getLocationDisplayName(locationDetails)}
                                </Typography>
                                {locationDetails['Address'] && (
                                  <Typography variant="body2">
                                    {locationDetails['Address']}
                                  </Typography>
                                )}
                                {locationDetails['Hours'] && (
                                  <Box display="flex" alignItems="center" mt={1}>
                                    <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                                    <Typography variant="caption">
                                      {locationDetails['Hours']}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </Box>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert severity="info" sx={{ mb: 4 }}>
                    <Box display="flex" alignItems="center">
                      <InfoIcon sx={{ mr: 1 }} />
                      Map not available - location coordinates not found
                    </Box>
                  </Alert>
                )}
              </>
            ) : selectedLocation && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No location details available
              </Alert>
            )}

          </Grid>

          {/* Right Column - Map and Procedures */}
          <Grid gridColumn="span 6">
            {/* Procedures */}
            {loading.procedures ? (
              <LoadingSkeleton count={3} />
            ) : procedures.length > 0 && (
              <Grid gridColumn="span 6">
                <Autocomplete
                  options={procedures}
                  getOptionLabel={option => option['Raw Name (EN)'] || option['Raw Name (TH)'] || option['Procedure ID'] || 'Unknown Procedure'}
                  value={procedures.find(p => p._id === (selectedProcedure?._id || selectedProcedure)) || null}
                  onChange={(e, newValue) => setSelectedProcedure(newValue || null)}
                  loading={loading.procedures}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select Procedure Offering"
                      placeholder="Type to search..."
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ style: { fontWeight: 'bold', color: '#1976d2' } }}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  sx={{ minWidth: 280, mb: 1 }}
                />
                {loading.procedures && <CircularProgress size={20} sx={{ mt: 1 }} />}
                {errors.procedures && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.procedures}
                  </Alert>
                )}
              </Grid>
            )}
            {procedures.length > 0 && (
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 40, height: 40 }}>
                      <MedicalIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Available Procedures ({procedures.length})
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                    {procedures.map(procedure => (
                      <React.Fragment key={procedure._id}>
                        <ProcedureCard
                          procedure={procedure}
                          providers={selectedProcedure?._id === procedure._id ? providers : []}
                          onSelect={setSelectedProcedure}
                          isSelected={selectedProcedure?._id === procedure._id}
                        />
                        {/* Show providers directly below the selected procedure */}
                        {selectedProcedure?._id === procedure._id && providers.length > 0 && (
                          <Card sx={{ mb: 2, boxShadow: 1, borderRadius: 2, ml: 2, mr: 2, background: '#f9f9fb' }}>
                            <CardContent>
                              <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 40, height: 40 }}>
                                  <PersonIcon />
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold">
                                  Available Providers ({providers.length})
                                </Typography>
                              </Box>
                              <Divider sx={{ mb: 2 }} />
                              <Grid container spacing={2}>
                                {providers.map(provider => (
                                  <Grid gridColumn="span 6" key={provider._id}>
                                    <Paper sx={{ 
                                      p: 2, 
                                      bgcolor: 'grey.50', 
                                      borderRadius: 2,
                                      transition: 'all 0.2s ease-in-out',
                                      '&:hover': {
                                        bgcolor: 'grey.100',
                                        transform: 'translateY(-1px)',
                                        boxShadow: 2
                                      }
                                    }}>
                                      {/* Provider Name and Gender */}
                                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle1" fontWeight="medium" flex={1}>
                                          {provider['Full Name(ENG)'] || provider['Full Name(THAI)'] || 'Unknown Provider'}
                                        </Typography>
                                        {provider['Gender'] && (
                                          <Box display="flex" alignItems="center">
                                            {provider['Gender'].toLowerCase() === 'male' ? (
                                              <MaleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                            ) : provider['Gender'].toLowerCase() === 'female' ? (
                                              <FemaleIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                                            ) : (
                                              <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            )}
                                            <Typography variant="caption" sx={{ ml: 0.5, color: 'text.secondary' }}>
                                              {provider['Gender']}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                      {/* Thai Name if different */}
                                      {provider['Full Name(THAI)'] && provider['Full Name(ENG)'] && provider['Full Name(THAI)'] !== provider['Full Name(ENG)'] && (
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                          {provider['Full Name(THAI)']}
                                        </Typography>
                                      )}
                                      {/* Specialties */}
                                      {provider['Specialties'] && (
                                        <Box mb={1}>
                                          <Box display="flex" alignItems="center" mb={0.5}>
                                            <WorkIcon sx={{ mr: 0.5, fontSize: 16, color: 'primary.main' }} />
                                            <Typography variant="caption" fontWeight="medium" color="primary">
                                              Specialties:
                                            </Typography>
                                          </Box>
                                          <Chip 
                                            label={provider['Specialties']} 
                                            size="small" 
                                            color="primary"
                                            variant="outlined"
                                            sx={{ fontSize: '0.75rem' }}
                                          />
                                        </Box>
                                      )}
                                      {/* Additional Info Row */}
                                      <Box display="flex" alignItems="center" justifyContent="space-between">
                                        {provider['Graduation Year'] && (
                                          <Box display="flex" alignItems="center">
                                            <SchoolIcon sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">
                                              {provider['Graduation Year']}
                                            </Typography>
                                          </Box>
                                        )}
                                        {provider['Provider ID'] && (
                                          <Typography variant="caption" color="text.secondary">
                                            ID: {provider['Provider ID']}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Paper>
                                  </Grid>
                                ))}
                              </Grid>
                            </CardContent>
                          </Card>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
            
            {errors.procedures && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.procedures}
              </Alert>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;