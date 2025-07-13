import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, MenuItem, Select, InputLabel, FormControl, Paper, Box, Divider, List, ListItem, ListItemText
} from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';

const API_BASE = 'http://localhost:8000';

function DetailCard({ title, data }) {
  if (!data) return null;
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Divider sx={{ mb: 1 }} />
        <List dense>
          {Object.entries(data).map(([key, value]) => (
            <ListItem key={key} disablePadding>
              <ListItemText
                primary={<b>{key.replace(/_/g, ' ')}</b>}
                secondary={typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
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

  useEffect(() => {
    axios.get(`${API_BASE}/clinics-hospitals`).then(res => {
      setClinics(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedClinic) {
      const found = clinics.find(c => c['Clinic ID'] === selectedClinic || c._id === selectedClinic);
      setClinicDetails(found || null);
    } else {
      setClinicDetails(null);
    }
  }, [selectedClinic, clinics]);

  useEffect(() => {
    if (selectedClinic) {
      axios.get(`${API_BASE}/locations`, { params: { clinicId: selectedClinic } }).then(res => {
        setLocations(res.data);
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

  useEffect(() => {
    if (selectedLocation) {
      const found = locations.find(l => l['Location ID'] === selectedLocation || l._id === selectedLocation);
      setLocationDetails(found || null);
    } else {
      setLocationDetails(null);
    }
  }, [selectedLocation, locations]);

  useEffect(() => {
    if (selectedClinic && selectedLocation) {
      axios.get(`${API_BASE}/procedure-offerings`, {
        params: { clinicId: selectedClinic, locationId: selectedLocation }
      }).then(res => {
        setProcedures(res.data);
        setSelectedProcedure(null);
        setProviders([]);
      });
    } else {
      setProcedures([]);
      setSelectedProcedure(null);
      setProviders([]);
    }
  }, [selectedClinic, selectedLocation]);

  useEffect(() => {
    if (selectedProcedure && selectedProcedure['Provider ID']) {
      const ids = Array.isArray(selectedProcedure['Provider ID'])
        ? selectedProcedure['Provider ID'].join(',')
        : selectedProcedure['Provider ID'];
      axios.get(`${API_BASE}/providers`, { params: { ids } }).then(res => {
        setProviders(res.data);
      });
    } else {
      setProviders([]);
    }
  }, [selectedProcedure]);

  function getLatLng(location) {
    if (!location) return null;
    let lat = location['Latitude'] || location['latitude'] || location['lat'];
    let lng = location['Longitude'] || location['longitude'] || location['lng'];
    if (typeof lat === 'string') lat = parseFloat(lat);
    if (typeof lng === 'string') lng = parseFloat(lng);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  }

  return (
    <Box sx={{ bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ mb: 4, bgcolor: '#1976d2' }}>
        <Toolbar>
          <RoomIcon sx={{ mr: 1 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Healthtech Hospitals & Clinics
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mb: 4, boxShadow: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Hospitals & Clinics</InputLabel>
                <Select
                  value={selectedClinic}
                  label="Hospitals & Clinics"
                  onChange={e => setSelectedClinic(e.target.value)}
                >
                  <MenuItem value="">Select a hospital/clinic</MenuItem>
                  {clinics.map(c => (
                    <MenuItem key={c._id} value={c['Clinic ID'] || c._id}>
                      {c['Clinic Name (EN)']}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {clinicDetails && (
              <Grid item xs={12}>
                <DetailCard title="Clinic/Hospital" data={clinicDetails} />
              </Grid>
            )}
            {locations.length > 0 && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Locations</InputLabel>
                    <Select
                      value={selectedLocation}
                      label="Locations"
                      onChange={e => setSelectedLocation(e.target.value)}
                    >
                      <MenuItem value="">Select a location</MenuItem>
                      {locations.map(l => (
                        <MenuItem key={l._id} value={l['Location ID'] || l._id}>
                          {l['Branch Name'] || l['Address']}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {locationDetails && (
                  <Grid item xs={12} md={6}>
                    <DetailCard title="Location" data={locationDetails} />
                  </Grid>
                )}
                {getLatLng(locationDetails) && (
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: 340, boxShadow: 3 }}>
                      <CardContent sx={{ height: 300, p: 0 }}>
                        <MapContainer
                          center={getLatLng(locationDetails)}
                          zoom={16}
                          style={{ height: '100%', width: '100%', borderRadius: 8 }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                          />
                          <Marker position={getLatLng(locationDetails)}>
                            <Popup>
                              {locationDetails['Branch Name'] || locationDetails['Address']}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </>
            )}
            {procedures.length > 0 && (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Procedure Offerings</InputLabel>
                    <Select
                      value={selectedProcedure ? selectedProcedure._id : ''}
                      label="Procedure Offerings"
                      onChange={e => {
                        const proc = procedures.find(p => p._id === e.target.value);
                        setSelectedProcedure(proc);
                      }}
                    >
                      <MenuItem value="">Select a procedure</MenuItem>
                      {procedures.map(p => (
                        <MenuItem key={p._id} value={p._id}>
                          {p['Raw Name (EN)'] || p['Raw Name (TH)'] || p['Procedure ID']}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {selectedProcedure && (
                  <Grid item xs={12}>
                    <DetailCard title="Procedure" data={selectedProcedure} />
                  </Grid>
                )}
              </>
            )}
            {providers.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Providers</Typography>
                <Grid container spacing={2}>
                  {providers.map(pr => (
                    <Grid item xs={12} md={6} key={pr._id}>
                      <DetailCard title={pr['Full Name(ENG)'] || 'Provider'} data={pr} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default App; 