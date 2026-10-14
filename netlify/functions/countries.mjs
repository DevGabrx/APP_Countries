const API_BASE_URL = 'https://api.restcountries.com/countries/v5';
const FUNCTION_PATH = '/.netlify/functions/countries';

function jsonResponse(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function getApiPath(pathname) {
  if (pathname.startsWith(FUNCTION_PATH)) {
    return pathname.slice(FUNCTION_PATH.length);
  }

  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return pathname.slice('/api'.length);
  }

  return null;
}

export default async function countriesHandler(request) {
  if (request.method !== 'GET') {
    return jsonResponse(405, 'Solo se permiten solicitudes GET.');
  }

  const requestUrl = new URL(request.url);
  const apiPath = getApiPath(requestUrl.pathname);

  if (apiPath === null || (apiPath !== '' && apiPath !== '/code')) {
    return jsonResponse(404, 'La ruta solicitada no existe.');
  }

  const apiKey = process.env.RESTCOUNTRIES_API_KEY;
  if (!apiKey) {
    console.error('Falta la variable RESTCOUNTRIES_API_KEY en el entorno de Netlify.');
    return jsonResponse(500, 'La API key no está configurada en Netlify.');
  }

  const upstreamUrl = new URL(`${API_BASE_URL}${apiPath}`);
  upstreamUrl.search = requestUrl.search;

  let upstream;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: request.signal,
    });
  } catch (error) {
    console.error('Error al conectar con REST Countries:', error);
    return jsonResponse(502, 'No fue posible conectar con REST Countries.');
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
