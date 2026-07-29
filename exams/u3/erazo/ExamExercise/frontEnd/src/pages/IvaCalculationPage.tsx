import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Paper, Chip, Alert, CircularProgress,
} from '@mui/material';
import { Percent } from '@mui/icons-material';
import { getProducts, getProductIva } from '../app/apiClient';

function IvaCalculationPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
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
    try {
      const data = await getProductIva(selectedId);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to calculate IVA.');
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <Percent sx={{ mr: 1, verticalAlign: 'middle' }} />
        IVA calculation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select a product from the database to calculate its IVA (15%).
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 8 }}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select value={selectedId} label="Product"
                  onChange={(e) => { setSelectedId(e.target.value); setResult(null); setError(''); }}
                  disabled={loading}
                >
                  {products.map((p: any) => (
                    <MenuItem key={p._id} value={p._id}>{p.name} - ${p.price.toFixed(2)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {loading && <CircularProgress size={20} sx={{ mt: 1 }} />}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button fullWidth variant="contained" startIcon={<Percent />}
                onClick={calculate} disabled={!selectedId || loading}>
                Calculate IVA
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
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Price (without IVA)</Typography>
              <Typography variant="h5">${result.product.price.toFixed(2)}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>IVA (15%)</Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                <Chip label={`$${result.iva.toFixed(2)}`} color="warning" size="medium" />
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>Price + IVA</Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">${result.pricePlusIva.toFixed(2)}</Typography>
            </Paper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default IvaCalculationPage;
