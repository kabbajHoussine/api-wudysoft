import fetch from "node-fetch";
import {
  randomUUID
} from "crypto";

function getOptanonDate() {
  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).replace(/, /g, "+").replace(/:/g, "%3A").replace(/\//g, "+");
  const timezoneName = "Waktu+Indonesia+Tengah";
  const tzOffset = date.getTimezoneOffset();
  const sign = tzOffset > 0 ? "-" : "+";
  const absOffset = Math.abs(tzOffset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMinutes = String(absOffset % 60).padStart(2, "0");
  const gmtOffset = `GMT${sign}${offsetHours}${offsetMinutes}`;
  return `${formattedDate}+${gmtOffset}+(${timezoneName})`;
}

function buildQueryUrl(baseUrl, params) {
  const query = Object.keys(params).filter(key => params[key] !== undefined && params[key] !== null).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
  return query ? `${baseUrl}?${query}` : baseUrl;
}
class CrunchyrollAPI {
  constructor() {
    this.baseURL = "https://beta-api.crunchyroll.com";
    this.token = null;
    this.tokenExpiry = null;
  }
  isTokenValid() {
    return this.token && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }
  _getClientHeaders() {
    const deviceId = randomUUID();
    const anonymousId = randomUUID();
    const consentId = randomUUID();
    const datestamp = getOptanonDate();
    const cookieValue = [`device_id=${deviceId}`, `ajs_anonymous_id=${anonymousId}`, `c_locale=id-ID`, `OptanonConsent=isGpcEnabled=0&datestamp=${datestamp}&version=202601.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&genVendors=V1%3A0%2CV17%3A0%2CV11%3A0%2CV3%3A0%2CV7%3A0%2CV2%3A0%2C&consentId=${consentId}&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A1&intType=1&geolocation=%3B&AwaitingReconsent=false`].join("; ");
    return {
      cookie: cookieValue,
      "etp-anonymous-id": anonymousId,
      accept: "application/json, text/plain, */*",
      origin: "https://www.crunchyroll.com",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36"
    };
  }
  async _getAuthHeaders() {
    await this.ensureAuth();
    const clientHeaders = this._getClientHeaders();
    clientHeaders.authorization = `Bearer ${this.token}`;
    return clientHeaders;
  }
  async getToken() {
    try {
      const response = await fetch("https://beta-api.crunchyroll.com/auth/v1/token", {
        headers: {
          authorization: "Basic Y3Jfd2ViOg==",
          "content-type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_id",
        method: "POST"
      });
      if (!response.ok) {
        console.error(`Failed to fetch token: ${response.status} ${response.statusText}`);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching token: ${error}`);
      return null;
    }
  }
  async ensureAuth() {
    if (this.isTokenValid()) return;
    try {
      console.log("⏳ Auto authenticating with Client ID Token...");
      const data = await this.getToken();
      this.token = data?.access_token || data?.token;
      this.tokenExpiry = Date.now() + ((data?.expires_in || 3600) - 60) * 1e3;
      console.log("✅ Client Auth success");
    } catch (err) {
      console.error("❌ Client Auth error:", err?.response?.data || err.message);
      throw err;
    }
  }
  async search({
    token,
    token_expiry,
    q,
    n = 6,
    type = "music,series,episode,top_results,movie_listing",
    ratings = true,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Searching...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/discover/search`, {
        q: q,
        n: n,
        type: type,
        ratings: ratings,
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Search complete");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Search error:", err.message);
      throw err;
    }
  }
  async tags({
    token,
    token_expiry,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting seasonal tags...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/discover/seasonal_tags`, {
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Tags failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Tags retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Tags error:", err.message);
      throw err;
    }
  }
  async browse({
    token,
    token_expiry,
    sort_by = "alphabetical",
    ratings = true,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Browsing...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/discover/browse/index`, {
        sort_by: sort_by,
        ratings: ratings,
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Browse failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Browse complete");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Browse error:", err.message);
      throw err;
    }
  }
  async rating({
    token,
    token_expiry,
    series_id,
    ...rest
  }) {
    try {
      console.log("⏳ Getting rating...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content-reviews/v3/rating/series/${series_id}`, {
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Rating failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Rating retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Rating error:", err.message);
      throw err;
    }
  }
  async seasons({
    token,
    token_expiry,
    series_id,
    force_locale = "",
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting seasons...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/cms/series/${series_id}/seasons`, {
        force_locale: force_locale,
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Seasons failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Seasons retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Seasons error:", err.message);
      throw err;
    }
  }
  async categories({
    token,
    token_expiry,
    guid,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting categories...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/discover/categories`, {
        guid: guid,
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Categories failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Categories retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Categories error:", err.message);
      throw err;
    }
  }
  async up_next({
    token,
    token_expiry,
    series_id,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting up next...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/discover/up_next/${series_id}`, {
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Up Next failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Up next retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Up next error:", err.message);
      throw err;
    }
  }
  async episodes({
    token,
    token_expiry,
    season_id,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting episodes...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/cms/seasons/${season_id}/episodes`, {
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Episodes failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Episodes retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Episodes error:", err.message);
      throw err;
    }
  }
  async prev_episode({
    token,
    token_expiry,
    episode_id,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting previous episode...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/discover/previous_episode/${episode_id}`, {
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Previous Episode failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Previous episode retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Previous episode error:", err.message);
      throw err;
    }
  }
  async series({
    token,
    token_expiry,
    series_id,
    locale = "id-ID",
    ...rest
  }) {
    try {
      console.log("⏳ Getting series...");
      this.token = token;
      this.tokenExpiry = token_expiry;
      const headers = await this._getAuthHeaders();
      const url = buildQueryUrl(`${this.baseURL}/content/v2/cms/series/${series_id}`, {
        locale: locale,
        ...rest
      });
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok) throw new Error(`Series failed: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log("✅ Series retrieved");
      return {
        ...data,
        token: this.token,
        token_expiry: this.tokenExpiry
      };
    } catch (err) {
      console.error("❌ Series error:", err.message);
      throw err;
    }
  }
}
export default async function handler(req, res) {
  const {
    action,
    ...params
  } = req.method === "GET" ? req.query : req.body;
  const validActions = ["search", "tags", "browse", "rating", "seasons", "categories", "up_next", "episodes", "prev_episode", "series"];
  if (!action) {
    return res.status(400).json({
      status: false,
      error: "Parameter 'action' wajib diisi.",
      available_actions: validActions,
      usage: {
        method: "GET / POST",
        example: "/?action=search&query=isekai"
      }
    });
  }
  const api = new CrunchyrollAPI();
  try {
    let response;
    switch (action) {
      case "search":
        if (!params.q) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'q' wajib diisi untuk action 'search'."
          });
        }
        response = await api.search(params);
        break;
      case "tags":
        response = await api.tags(params);
        break;
      case "browse":
        response = await api.browse(params);
        break;
      case "rating":
        if (!params.series_id) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'series_id' wajib diisi untuk action 'rating'."
          });
        }
        response = await api.rating(params);
        break;
      case "seasons":
        if (!params.series_id) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'series_id' wajib diisi untuk action 'seasons'."
          });
        }
        response = await api.seasons(params);
        break;
      case "categories":
        if (!params.guid) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'guid' wajib diisi untuk action 'categories'."
          });
        }
        response = await api.categories(params);
        break;
      case "up_next":
        if (!params.series_id) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'series_id' wajib diisi untuk action 'up_next'."
          });
        }
        response = await api.up_next(params);
        break;
      case "episodes":
        if (!params.season_id) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'season_id' wajib diisi untuk action 'episodes'."
          });
        }
        response = await api.episodes(params);
        break;
      case "prev_episode":
        if (!params.episode_id) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'episode_id' wajib diisi untuk action 'prev_episode'."
          });
        }
        response = await api.prev_episode(params);
        break;
      case "series":
        if (!params.series_id) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'series_id' wajib diisi untuk action 'series'."
          });
        }
        response = await api.series(params);
        break;
      default:
        return res.status(400).json({
          status: false,
          error: `Action tidak valid: ${action}.`,
          valid_actions: validActions
        });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error(`[FATAL ERROR] Kegagalan pada action '${action}':`, error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan internal pada server atau target website.",
      error: error.message || "Unknown Error"
    });
  }
}