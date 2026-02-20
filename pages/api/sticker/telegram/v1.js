import axios from "axios";
const TG = "https://api.telegram.org";
const BOT_TOKEN = "891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4";
class TgBotDL {
  constructor() {
    this.http = axios.create({
      baseURL: `${TG}/bot${BOT_TOKEN}`,
      timeout: 3e4,
      validateStatus: s => s < 500
    });
    this.token = BOT_TOKEN;
  }
  async set(name) {
    console.log("[set] name:", name);
    try {
      const res = await this.http.get("/getStickerSet", {
        params: {
          name: name
        }
      });
      const stickers = res.data?.result?.stickers || [];
      console.log("[set] stickers:", stickers.length);
      return stickers;
    } catch (err) {
      console.error("[set] error:", err?.response?.data || err?.message);
      return [];
    }
  }
  async file(file_id) {
    console.log("[file] id:", file_id);
    try {
      const res = await this.http.get("/getFile", {
        params: {
          file_id: file_id
        }
      });
      const path = res.data?.result?.file_path;
      return path ? `${TG}/file/bot${this.token}/${path}` : null;
    } catch (err) {
      console.error("[file] error:", err?.response?.data || err?.message);
      return null;
    }
  }
  async download({
    query,
    all,
    sticker
  }) {
    console.log("[download] query:", query, "| all:", all, "| sticker:", sticker);
    if (!query) throw new Error("Parameter 'query' diperlukan.");
    const stickers = await this.set(query);
    if (all === "true" || all === true) {
      const result = await Promise.all(stickers.map(async s => ({
        ...s,
        file_url: await this.file(s.file_id)
      })));
      return {
        result: result
      };
    }
    if (sticker) {
      const idx = parseInt(sticker, 10) - 1;
      if (idx < 0 || idx >= stickers.length) throw new Error("Stiker tidak ditemukan.");
      const s = stickers[idx];
      return {
        result: [{
          ...s,
          file_url: await this.file(s.file_id)
        }]
      };
    }
    throw new Error("Parameter 'all' atau 'sticker' diperlukan.");
  }
}
export default async function handler(req, res) {
  const params = req.method === "GET" ? req.query : req.body;
  if (!params.query) {
    return res.status(400).json({
      error: "Parameter 'query' diperlukan"
    });
  }
  const api = new TgBotDL();
  try {
    const data = await api.download(params);
    return res.status(200).json(data);
  } catch (error) {
    const errorMessage = error.message || "Terjadi kesalahan saat memproses URL";
    return res.status(500).json({
      error: errorMessage
    });
  }
}