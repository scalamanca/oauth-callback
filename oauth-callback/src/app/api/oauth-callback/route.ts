import { NextResponse } from 'next/server'
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.json({ message: 'No authorization code received' }, { status: 400 })
  }

  try {
    const tokenResponse = await fetch('https://start.exactonline.nl/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.EXACT_CLIENT_ID!,
        client_secret: process.env.EXACT_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://collep.nl/api/oauth-callback'
      })
    });

    const tokenData = await tokenResponse.json();
    return NextResponse.redirect(new URL('/auth-success', request.url))
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth-error', request.url))
  }
}