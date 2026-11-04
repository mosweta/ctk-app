import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis successfully'));

redisClient.connect().catch(console.error);

export const cache = (durationInSeconds) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      
      res.json = (body) => {
        redisClient.setEx(key, durationInSeconds, JSON.stringify(body))
          .catch(err => console.error('Redis Save Error:', err));
          
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Redis Get Error:', err);
      next();
    }
  };
};

export const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared cache for: ${pattern}`);
    }
  } catch (err) {
    console.error('Cache clear error:', err);
  }
};