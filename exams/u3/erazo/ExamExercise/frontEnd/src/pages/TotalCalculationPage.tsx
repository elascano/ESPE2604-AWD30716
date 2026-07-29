import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Alert,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { calculateCartTotal } from '../app/apiClient';

function TotalCalculationPage() {
  const [entries, setEntries] = useState(Array.from({ length: 5 }, () => ({ name: '', price: '' })));
  const [result, setResult] = useState<{ items: any[]; subtotal: number; iva: number; ivaRate: number; total: number } | null>(null);
  const [error, setError] = useState('');

  function update(i: number, field: string, val: string) {
    const updated = [...entries];
    (updated[i] as any)[field] = val;
    setEntries(updated);
  }

  async function calculate() {
    setError('');
    setResult(null);
    const items = entries
      .filter(e => e.name.trim() && e.price.trim())
      .map(e => {
        const price = parseFloat(e.price) || 0;
        return { name: e.name.trim(), price, quantity: 1 };
      });
    if (!items.length) { setError('Enter at least one product name and price.'); return; }
    try {
      const data = await calculateCartTotal(items);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to calculate the total.');
    }
  }

  function clearAll() {
    setEntries(Array.from({ length: 5 }, () => ({ name: '', price: '' })));
    setResult(null);
    setError('');
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
        Total calculation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enter the name and price of up to 5 products to compute their total.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {entries.map((e, i) => (
            <Grid container spacing={2} key={i} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label={`Product ${i + 1} name`} value={e.name}
                  onChange={(ev) => update(i, 'name', ev.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth size="small" label={`Product ${i + 1} price`} type="number" value={e.price}
                  onChange={(ev) => update(i, 'price', ev.target.value)} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
              </Grid>
            </Grid>
          ))}
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" startIcon={<ShoppingCart />} onClick={calculate}>Calculate Total</Button>
            <Button variant="outlined" color="secondary" onClick={clearAll}>Clear</Button>
          </Box>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1">Subtotal: <strong>${result.subtotal.toFixed(2)}</strong></Typography>
              <Typography variant="body1">IVA (15%): <Chip label={`$${result.iva.toFixed(2)}`} color="warning" size="small" /></Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                Total: <Chip label={`$${result.total.toFixed(2)}`} color="success" />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default TotalCalculationPage;
