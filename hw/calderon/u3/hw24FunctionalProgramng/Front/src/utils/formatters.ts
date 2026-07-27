// src/utils/formatters.ts

export const formatPrice = (price: number | string): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(price));
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'pending': 'yellow',
    'confirmed': 'blue',
    'completed': 'green',
    'cancelled': 'red',
  };
  return colors[status.toLowerCase()] || 'gray';
};

export const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    'pending': 'Pendiente',
    'Pending': 'Pendiente',
    'Pendiente': 'Pendiente',
    'confirmed': 'Confirmada',
    'Confirmed': 'Confirmada',
    'Confirmada': 'Confirmada',
    'completed': 'Completada',
    'Completed': 'Completada',
    'Completada': 'Completada',
    'cancelled': 'Cancelada',
    'Cancelled': 'Cancelada',
    'Cancelada': 'Cancelada',
  };
  return labels[status.toLowerCase()] || status;
};
