import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Paper, Chip, Alert, CircularProgress,
} from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { getProducts, getProductExpiration } from '../app/apiClient';

function ExpirationCalculationPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Failed to load products from database.'))
      .finally(() => setLoading(false));
  }, []);

  async function calculate() {
    setError('');
    setResult(null);
    if (!selectedId) { setError('Select a product.'); return; }
    if (!day || !month || !year) { setError('Enter the expiration date.'); return; }
    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    if (d < 1 || d > 31) { setError('Day must be 1-31.'); return; }
    if (m < 1 || m > 12) { setError('Month must be 1-12.'); return; }
    if (y < 2024 || y > 2100) { setError('Year must be 2024-2100.'); return; }
    try {
      const data = await getProductExpiration(selectedId, d, m, y);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to calculate expiration.');
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle' }} />
        Expiration time calculation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select a product from the database and enter its expiration date.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select value={selectedId} label="Product"
                  onChange={(e) => { setSelectedId(e.target.value); setResult(null); setError(''); }}
                  disabled={loading}>
                  {products.map((p: any) => (
                    <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading && <CircularProgress size={20} sx={{ mt: 1 }} />}
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField fullWidth label="Day" type="number" value={day}
                onChange={(e) => setDay(e.target.value)} slotProps={{ htmlInput: { min: 1, max: 31 } }} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField fullWidth label="Month" type="number" value={month}
                onChange={(e) => setMonth(e.target.value)} slotProps={{ htmlInput: { min: 1, max: 12 } }} />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField fullWidth label="Year" type="number" value={year}
                onChange={(e) => setYear(e.target.value)} slotProps={{ htmlInput: { min: 2024, max: 2100 } }} />
            </Grid>
            <Grid size={12}>
              <Button fullWidth variant="contained" startIcon={<CalendarMonth />}
                onClick={calculate} disabled={!selectedId || loading}>
                Calculate Days Left
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {result && (
        <Card>
          <CardContent>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Product</Typography>
              <Typography variant="h5" fontWeight="bold">{result.product.name}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Expiration Date</Typography>
              <Typography variant="h6">{result.expirationDate}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Days Left to Sell</Typography>
              <Typography variant="h3" fontWeight="bold"
                color={result.isExpired ? 'error.main' : result.daysLeft <= 7 ? 'warning.main' : 'success.main'}>
                {result.daysLeft}
              </Typography>
              <Chip label={result.status}
                color={result.isExpired ? 'error' : result.daysLeft <= 7 ? 'warning' : 'success'} sx={{ mt: 1 }} />
            </Paper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ExpirationCalculationPage;
