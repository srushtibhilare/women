import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import './Scanner.css';

const Scanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError('');

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="scanner-container">
      <Paper className="scanner-panel">
        <div className="corner-br"></div>
        
        <Typography variant="h4" className="scanner-title" gutterBottom>
          DOCUMENT SCANNER
        </Typography>
        
        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Button
                className="holographic-btn"
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  '& .MuiSvgIcon-root': {
                    filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.7))'
                  }
                }}
              >
                SELECT DOCUMENT
                <input
                  type="file"
                  hidden
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <Typography variant="body2" className="file-selected">
                  SELECTED: {file.name}
                </Typography>
              )}

              <Button
                className="holographic-btn"
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                disabled={!file || loading}
              >
                {loading ? 'PROCESSING...' : 'SCAN DOCUMENT'}
              </Button>

              {loading && (
                <Box className="scanning-loader-container">
                  <LinearProgress className="scanning-loader" />
                </Box>
              )}

              {error && (
                <Alert severity="error" className="error-alert">
                  {error}
                </Alert>
              )}

              {preview && (
                <Box sx={{ mt: 2 }} className="preview-container">
                  <Typography variant="h6" className="preview-title" gutterBottom>
                    DOCUMENT PREVIEW
                  </Typography>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="preview-image"
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '300px',
                      display: 'block',
                      margin: '0 auto'
                    }} 
                  />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h5" className="results-title" gutterBottom>
                SCAN RESULTS
              </Typography>
              
              {result ? (
                <Card className="result-card-3d" sx={{ flex: 1 }}>
                  <CardContent>
                    <Alert 
                      severity={result.isRelevant ? "success" : "warning"}
                      sx={{ 
                        mb: 2,
                        backgroundColor: result.isRelevant ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 157, 0, 0.2)',
                        color: 'white',
                        borderLeft: '4px solid',
                        borderLeftColor: result.isRelevant ? 'var(--matrix-green)' : 'var(--cyber-orange)'
                      }}
                    >
                      {result.message}
                    </Alert>
                    <Box className="result-content">
                      {result.text}
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Box className="empty-state" sx={{ height: '300px' }}>
                  <Typography className="empty-state-text">
                    AWAITING SCAN DATA...
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Scanner;