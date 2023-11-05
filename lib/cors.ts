const setCorsHeaders = (res: Response) => {
  // Replace the following with the origin(s) you want to allow
  const ALLOWED_ORIGINS = ['http://localhost:3001'];

  const origin = res.headers.get('Origin');

  if (ALLOWED_ORIGINS.includes(origin || '')) {
    res.headers.set('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.headers.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return res;
};

export default setCorsHeaders;





