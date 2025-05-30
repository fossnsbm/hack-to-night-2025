import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const fileUrl = request.nextUrl.searchParams.get('fileUrl');

    if (!token || !fileUrl) {
        return NextResponse.json(
            { error: 'Missing token or file URL' },
            { status: 400 }
        );
    }

    const res = await verifyToken(token);
    if (!res) {
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }

    try {
        const response = await fetch(process.env.CTFD_URL + fileUrl);
        
        if (!response.ok) {
            console.error('File download failed:', response.statusText);
            return NextResponse.json(
                { error: 'Failed to download file' },
                { status: 500 }
            );
        }

        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': contentType || 'application/octet-stream',
                'Content-Disposition': contentDisposition || 'attachment',
            },
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json(
            { error: 'Failed to download file' },
            { status: 500 }
        );
    }
} 