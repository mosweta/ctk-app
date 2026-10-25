/**
 * Daily readings service.
 *
 * Fetches Catholic Mass readings from the Evangelizo npm package,
 * caches them in Supabase (daily_readings_cache table), and serves
 * them from cache for 6 hours before refetching.
 *
 * This is a self-contained copy of the readings logic. It has no
 * dependency on the standalone daily-readings app or any other
 * external service. Only Evangelizo (npm package) and Supabase.
 */

import evangelizo from 'evangelizo';
import { supabaseAdmin } from '../lib/supabaseClient.js';

const CACHE_TTL_HOURS = 6;

/**
 * Derive liturgical color from the title string.
 * The evangelizo package does not expose a getLiturgicColor method,
 * so we infer the color from the liturgical title.
 */
const inferLiturgicalColor = (title) => {
  if (!title) return 'Green';
  const t = title.toLowerCase();
  
  if (t.includes('easter') || t.includes('christmas') || t.includes('nativity')) {
    return 'White';
  }
  if (t.includes('pentecost') || t.includes('good friday') || t.includes('passion') || t.includes('martyr')) {
    return 'Red';
  }
  if (t.includes('lent') || t.includes('advent')) {
    return 'Purple';
  }
  if (t.includes('gaudete') || t.includes('laetare')) {
    return 'Rose';
  }
  if (t.includes('requiem') || t.includes('all souls')) {
    return 'Black';
  }
  
  return 'Green'; // Ordinary Time default
};

/**
 * Fetch a full day's readings directly from Evangelizo.
 *
 * @param {string} dateYYYYMMDD - date in YYYYMMDD format (e.g., "20260314")
 * @returns {object} - normalized readings object
 */
const fetchFromEvangelizo = async (dateYYYYMMDD) => {
  const options = { date: parseInt(dateYYYYMMDD), lang: 'AM' };

  const [
    title,
    saint,
    frTitle, frText,
    psTitle, psText,
    srTitle, srText,
    gspTitle, gspText,
  ] = await Promise.all([
    evangelizo.getLiturgicTitle(options).catch(() => 'Daily Liturgy'),
    evangelizo.getSaint(options).catch(() => 'Saint of the Day'),
    evangelizo.getReadingLt('FR', options).catch(() => ''),
    evangelizo.getReading('FR', options).catch(() => ''),
    evangelizo.getReadingLt('PS', options).catch(() => ''),
    evangelizo.getReading('PS', options).catch(() => ''),
    evangelizo.getReadingLt('SR', options).catch(() => ''),
    evangelizo.getReading('SR', options).catch(() => ''),
    evangelizo.getReadingLt('GSP', options).catch(() => ''),
    evangelizo.getReading('GSP', options).catch(() => ''),
  ]);

  const color = inferLiturgicalColor(title);

  const cleanSaint = saint
    ? saint.split('(')[0].replace(/St\./g, 'Saint').trim()
    : 'Saint of the Day';

  const readings = [
    { label: 'First Reading', title: frTitle, text: frText },
    { label: 'Responsorial Psalm', title: psTitle, text: psText },
    { label: 'Second Reading', title: srTitle, text: srText },
    { label: 'Holy Gospel', title: gspTitle, text: gspText },
  ].filter((r) => r.text && r.text.trim() !== '');

  return {
    title: title || 'Daily Liturgy',
    color,
    saint: { name: cleanSaint },
    readings,
  };
};

/**
 * Returns today's (or a specific date's) readings.
 * Uses cache when fresh, otherwise fetches from Evangelizo and stores.
 *
 * @param {Date} [date=new Date()] - date to fetch
 * @returns {object} - readings object
 */
export const getDailyReadings = async (date = new Date()) => {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. Try cache
  const { data: cached } = await supabaseAdmin
    .from('daily_readings_cache')
    .select('*')
    .eq('reading_date', dateStr)
    .gt('fetched_at', new Date(Date.now() - CACHE_TTL_HOURS * 3600000).toISOString())
    .maybeSingle();

  if (cached) return cached.data;

  // 2. Cache miss - fetch and store
  const compact = dateStr.replace(/-/g, '');
  const readings = await fetchFromEvangelizo(compact);

  await supabaseAdmin
    .from('daily_readings_cache')
    .upsert(
      {
        reading_date: dateStr,
        data: readings,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: 'reading_date' }
    );

  return readings;
};

/**
 * Force a refetch of a specific date, bypassing the cache.
 * Used by admin actions.
 *
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {object} - readings object
 */
export const refreshReadings = async (dateStr) => {
  await supabaseAdmin
    .from('daily_readings_cache')
    .delete()
    .eq('reading_date', dateStr);

  return getDailyReadings(new Date(dateStr));
};