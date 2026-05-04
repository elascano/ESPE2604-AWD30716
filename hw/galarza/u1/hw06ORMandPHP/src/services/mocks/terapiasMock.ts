/**
 * Datos mock de terapias
 */

import { Terapia } from '../../types';

export const mockTerapias: Terapia[] = [
  {
    id: 1,
    nombre: 'Fisioterapia General',
    descripcion: 'Tratamiento para lesiones musculares, rehabilitación postoperatoria y mejora de movilidad.',
    duracion: 60,
    precio: 45.00,
    imagen: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    especialidad: 'Fisioterapia',
    activa: true,
  },
  {
    id: 2,
    nombre: 'Terapia Ocupacional',
    descripcion: 'Ayuda a personas a desarrollar, recuperar o mantener las habilidades necesarias para la vida diaria.',
    duracion: 60,
    precio: 50.00,
    imagen: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
    especialidad: 'Terapia Ocupacional',
    activa: true,
  },
  {
    id: 3,
    nombre: 'Terapia Psicológica Individual',
    descripcion: 'Sesiones personalizadas para manejo de ansiedad, depresión, estrés y otros trastornos emocionales.',
    duracion: 50,
    precio: 60.00,
    imagen: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    especialidad: 'Psicología',
    activa: true,
  },
  {
    id: 4,
    nombre: 'Rehabilitación Deportiva',
    descripcion: 'Tratamiento especializado para lesiones deportivas y recuperación de atletas.',
    duracion: 75,
    precio: 65.00,
    imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    especialidad: 'Fisioterapia',
    activa: true,
  },
  {
    id: 5,
    nombre: 'Terapia de Lenguaje',
    descripcion: 'Tratamiento para trastornos del habla, lenguaje y comunicación.',
    duracion: 45,
    precio: 55.00,
    imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    especialidad: 'Terapia de Lenguaje',
    activa: true,
  },
  {
    id: 6,
    nombre: 'Masoterapia',
    descripcion: 'Masajes terapéuticos para alivio del dolor, relajación muscular y mejora de circulación.',
    duracion: 60,
    precio: 40.00,
    imagen: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    especialidad: 'Fisioterapia',
    activa: true,
  },
];
