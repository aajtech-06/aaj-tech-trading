import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://aajtechtrading.in';

async function handleProxy(request: NextRequest) {
  const searchParams = request.nextUrl.search;
  const path = request.nextUrl.pathname.replace(/^\/backend-api/, '');
  const targetUrl = `${BACKEND_URL}/api${path}${searchParams}`;

  // Clone request headers and clean up host headers
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');

  // Forward admin_token cookie securely as Authorization header
  const token = request.cookies.get('admin_token')?.value;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body: any = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.blob();
    } catch {
      // Body reading not possible or absent
    }
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      duplex: 'half',
    } as any);

    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    const responseBody = await backendResponse.blob();

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Error routing request to backend' }, { status: 502 });
  }
}

export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as DELETE };
