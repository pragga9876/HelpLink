import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize a Prisma client for this request only (don't save globally)
const prisma = new PrismaClient();

export async function GET() {
    // Log the start of the connection test
    console.log('--- Database Connection Test ---');
    console.log('Checking environment variable:');
    
    // Check if the DATABASE_URL environment variable exists
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('DATABASE_URL is not set!');
        return NextResponse.json({ error: 'DATABASE_URL is missing' }, { status: 500 });
    }

    // Log the type of database Vercel is trying to use
    const isPostgres = dbUrl.startsWith('postgresql://');
    const isSqlite = dbUrl.includes('file:');
    console.log(`Connection string type: ${isPostgres ? 'PostgreSQL' : isSqlite ? 'SQLite' : 'Unknown'}`);
    
    // Attempt to connect to the database to see if it's reachable
    try {
        // A simple, fast query to test the connection
        await prisma.$queryRaw`SELECT 1 as result`;
        
        console.log('Database connection: SUCCESSFUL');
        return NextResponse.json({ 
            status: 'ok', 
            dbType: isPostgres ? 'PostgreSQL' : isSqlite ? 'SQLite' : 'Unknown',
            message: 'Successfully connected to the database!'
        });
    } catch (error: any) {
        console.error('Database connection: FAILED');
        console.error('Error message:', error?.message);
        return NextResponse.json({ 
            status: 'error', 
            dbType: isPostgres ? 'PostgreSQL' : isSqlite ? 'SQLite' : 'Unknown',
            error: error?.message 
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}