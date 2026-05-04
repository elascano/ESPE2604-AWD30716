import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
    const insumos = await prisma.insumo.findMany({ orderBy: { creado_en: 'desc' } });
    return NextResponse.json(insumos);
}

export async function POST(req: Request) {
    const body = await req.json();
    const nuevo = await prisma.insumo.create({
        data: {
            nombre: body.nombre,
            tipo: body.tipo,
            horas_uso: Number(body.horas_uso) || 0,
                                             fecha_calibracion: body.fecha_calibracion,
                                             stock: Number(body.stock) || 0,
                                             estado: body.estado || 'IN_USE'
        }
    });
    return NextResponse.json(nuevo);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const actualizado = await prisma.insumo.update({
        where: { id: body.id },
        data: {
            nombre: body.nombre,
            horas_uso: Number(body.horas_uso) || 0,
                                                   fecha_calibracion: body.fecha_calibracion,
                                                   stock: Number(body.stock) || 0,
                                                   estado: body.estado
        }
    });
    return NextResponse.json(actualizado);
}
