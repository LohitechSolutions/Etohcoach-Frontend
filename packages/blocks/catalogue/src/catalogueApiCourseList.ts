/**
 * Normalizes Rails catalogue / profile course API payloads for Catalogue UI.
 * Handles JSON:API-style `{ data: [{ id, attributes }] }` and flat rows.
 */

function asRecord(x: unknown): Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x) ? (x as Record<string, unknown>) : {};
}

function str(x: unknown, fallback = ''): string {
  return typeof x === 'string' ? x : x != null ? String(x) : fallback;
}

/** Collect list nodes from common API wrapper shapes. */
export function extractRawCourseList(responseJson: unknown): unknown[] {
  if (responseJson == null) return [];
  if (Array.isArray(responseJson)) return responseJson;

  const root = asRecord(responseJson);
  const direct = root['data'];
  if (Array.isArray(direct)) return direct;
  if (direct != null && typeof direct === 'object' && !Array.isArray(direct)) {
    const d = asRecord(direct);
    for (const k of ['courses', 'catalogues', 'catalogue', 'items', 'results', 'data']) {
      const v = d[k];
      if (Array.isArray(v)) return v;
      if (v != null && typeof v === 'object' && !Array.isArray(v)) {
        const inner = asRecord(v);
        for (const ik of ['courses', 'catalogues', 'catalogue', 'data', 'items']) {
          const iv = inner[ik];
          if (Array.isArray(iv)) return iv;
        }
      }
    }
  }
  for (const k of ['courses', 'catalogues', 'items', 'results']) {
    const v = root[k];
    if (Array.isArray(v)) return v;
  }
  return [];
}

function railsAttr(item: unknown): Record<string, unknown> {
  const r = asRecord(item);
  const a = r['attributes'];
  return a !== null && typeof a === 'object' && !Array.isArray(a) ? (a as Record<string, unknown>) : {};
}

/**
 * Dashboard / admin use funnel pillars (Attract, Convince, …) and sometimes `drinktype`.
 * Catalogue chips + filters still use Wine / Beer / Spirits — map so rows are visible and filterable.
 */
export function mapRailsDrinkOrPillarToCatalogueDrinkType(raw: string): string {
  const s = String(raw || '')
    .trim()
    .toLowerCase();
  if (!s) return 'Wine';
  if (s === 'attract' || s === 'retain') return 'Wine';
  if (s === 'convince') return 'Beer';
  if (s === 'convert' || s === 'grow') return 'Spirits';
  if (s === 'wine') return 'Wine';
  if (s === 'beer') return 'Beer';
  if (s === 'spirits' || s === 'spirit') return 'Spirits';
  const cap = raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1).toLowerCase();
  if (cap === 'Wine' || cap === 'Beer' || cap === 'Spirits') return cap;
  return 'Wine';
}

/**
 * One row as expected by Catalogue.tsx / navigation (course_name, id, drink_type, …).
 */
export function normalizeCatalogueRow(item: unknown): Record<string, unknown> | null {
  if (item == null) return null;
  const r = asRecord(item);
  const a = railsAttr(item);

  const id = str(r['id'] ?? a['id'] ?? a['course_id'] ?? r['course_id'], '');
  if (!String(id).trim()) return null;

  const course_name = str(
    a['course_name'] ?? a['name'] ?? a['title'] ?? r['course_name'] ?? r['name'] ?? r['title'],
    '',
  );
  if (!course_name.trim()) return null;

  const course_attachment = str(
    a['course_attachment'] ??
      a['image_url'] ??
      a['image'] ??
      a['attachment'] ??
      a['attachment_url'] ??
      r['course_attachment'],
    '',
  );

  const drinkRaw = str(
    a['drink_type'] ??
      a['drinktype'] ??
      a['pillar'] ??
      a['category'] ??
      r['drink_type'] ??
      r['drinktype'] ??
      r['pillar'] ??
      r['category'] ??
      'Wine',
    'Wine',
  );
  const drink_type = mapRailsDrinkOrPillarToCatalogueDrinkType(drinkRaw);

  const value = str(a['value'] ?? r['value'] ?? 'Unpaid', 'Unpaid');
  const language_type = str(a['language'] ?? a['language_type'] ?? r['language_type'] ?? 'en', 'en');
  const description = str(
    a['description'] ?? a['short_description'] ?? r['description'] ?? r['short_description'],
    '',
  );
  const certificate = str(a['certificate'] ?? r['certificate'] ?? '—', '—');
  const difficulty = str(a['difficulty'] ?? r['difficulty'] ?? 'Beginner', 'Beginner');

  const course_status = str(
    a['course_status'] ?? r['course_status'] ?? 'not_started',
    'not_started',
  );
  const completion = str(a['completion'] ?? r['completion'] ?? 'not_started', 'not_started');

  return {
    id,
    course_name,
    course_attachment,
    value,
    drink_type,
    language_type,
    description,
    certificate,
    difficulty,
    course_status,
    completion,
    themes_count: Number(a['themes_count'] ?? r['themes_count'] ?? 1) || 1,
    user_theme_count: Number(a['user_theme_count'] ?? r['user_theme_count'] ?? 0) || 0,
    user_completed_point: Number(a['user_completed_point'] ?? r['user_completed_point'] ?? 0) || 0,
    course_total_point: Number(a['course_total_point'] ?? r['course_total_point'] ?? 0) || 0,
    user_course_percentage: Number(a['user_course_percentage'] ?? r['user_course_percentage'] ?? 0) || 0,
  };
}

export function normalizeCourseList(raw: unknown[]): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  for (const item of raw) {
    const row = normalizeCatalogueRow(item);
    if (row) out.push(row);
  }
  return out;
}

/** Normalize a single API response object into catalogue rows (handles nested `data`). */
export function catalogueRowsFromApiJson(responseJson: unknown): Record<string, unknown>[] {
  let rows = normalizeCourseList(extractRawCourseList(responseJson));
  if (rows.length === 0 && responseJson !== null && typeof responseJson === 'object') {
    const d = (responseJson as Record<string, unknown>)['data'];
    if (Array.isArray(d)) {
      rows = normalizeCourseList(d);
    }
  }
  return rows;
}

function buildAuthHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const t = token && String(token).trim();
  if (t) {
    headers['token'] = t;
    if (t.includes('.') && t.length > 20) {
      headers['Authorization'] = `Bearer ${t}`;
    }
  }
  return headers;
}

function joinUrl(base: string, path: string): string {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return p ? `${b}/${p}` : b;
}

/** Union catalogue list with profile list: admin catalogue is source of truth for visibility; profile overlays progress fields. */
export function mergeCatalogueAndProfileRows(
  catalogueRows: Record<string, unknown>[],
  profileRows: Record<string, unknown>[],
): Record<string, unknown>[] {
  const profileById = new Map(profileRows.map((r) => [String(r.id), r]));
  const seen = new Set<string>();
  const out: Record<string, unknown>[] = [];
  for (const c of catalogueRows) {
    const id = String(c.id);
    seen.add(id);
    const p = profileById.get(id);
    out.push(p ? { ...c, ...p } : { ...c });
  }
  for (const p of profileRows) {
    const id = String(p.id);
    if (!seen.has(id)) out.push({ ...p });
  }
  return out;
}

/**
 * Loads profile/courses and catalogue/catalogues, then merges so courses visible in admin
 * catalogue still appear when profile/courses returns only enrolled rows or an empty list.
 */
export async function fetchCatalogueCourseRowsWithFallback(
  baseURL: string,
  token: string | null,
): Promise<{ rows: Record<string, unknown>[]; source: 'profile/courses' | 'catalogue/catalogues' | 'both' }> {
  const b = String(baseURL || '').trim();
  if (!b) {
    return { rows: [], source: 'profile/courses' };
  }

  const headers = buildAuthHeaders(token);

  const tryProfile = async (): Promise<Record<string, unknown>[]> => {
    const url = joinUrl(b, 'profile/courses');
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ keyword: '' }),
    });
    const text = await res.text();
    if (__DEV__ && !res.ok) {
      console.warn('[Catalogue] profile/courses HTTP', res.status, text.slice(0, 200));
    }
    let json: unknown = null;
    try {
      json = text.trim() ? JSON.parse(text) : null;
    } catch {
      return [];
    }
    const raw = extractRawCourseList(json);
    return normalizeCourseList(raw);
  };

  /** List endpoint is GET; POST requires category + sub_category (422 if omitted). */
  const tryCatalogue = async (): Promise<Record<string, unknown>[]> => {
    const url = joinUrl(b, 'catalogue/catalogues');
    const res = await fetch(url, { method: 'GET', headers });
    const text = await res.text();
    if (__DEV__ && !res.ok) {
      console.warn('[Catalogue] GET catalogue/catalogues HTTP', res.status, text.slice(0, 200));
    }
    let json: unknown = null;
    try {
      json = text.trim() ? JSON.parse(text) : null;
    } catch {
      return [];
    }
    return normalizeCourseList(extractRawCourseList(json));
  };

  const [primary, catalogue] = await Promise.all([tryProfile(), tryCatalogue()]);

  if (catalogue.length > 0 && primary.length > 0) {
    return { rows: mergeCatalogueAndProfileRows(catalogue, primary), source: 'both' };
  }
  if (catalogue.length > 0) {
    return { rows: catalogue, source: 'catalogue/catalogues' };
  }
  if (primary.length > 0) {
    return { rows: primary, source: 'profile/courses' };
  }

  if (__DEV__) {
    console.warn(
      '[Catalogue] No courses from profile/courses or catalogue/catalogues. Your dashboard logs also show total_courses: 0 for all pillars — the Railway API is not returning published catalogue rows for this user; fix backend aggregation / publishing, not the offline queue (online/data success_count: 0 is normal when offline_task is empty).',
    );
  }

  return { rows: [], source: 'profile/courses' };
}
