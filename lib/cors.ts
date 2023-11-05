const setCorsHeaders = (res: Response) => {
  // Replace the following with the origin(s) you want to allow
  const ALLOWED_ORIGINS = ['https://giardelli-gonzalez-web.vercel.app'];

  const origin = res.headers.get('Origin');

  if (ALLOWED_ORIGINS.includes(origin || '')) {
    res.headers.set('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.headers.set('Access-Control-Allow-Methods', 'GET, DELETE, PATCH, POST, PUT, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return res;
};

export default setCorsHeaders;





