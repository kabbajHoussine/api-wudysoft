import axios from "axios";
import CryptoJS from "crypto-js";
import SpoofHead from "@/lib/spoof-head";
class InsMelo {
  constructor() {
    this.baseUrl = "https://server.insmelo.com";
    this.keys = ["xvrEXqz1z0CAvd3LsJ9QJQasK1fOsQcTmEDten6gewU=", "D8zkQYqOYCKX/gYNE50tW860xYZdrGzdb6wxQ+DrZ3Y=", "PSzactGgQhtGJMw+gNnOHAQOkszfl/3afpaWmSl5u38=", "f8NxZ5CSe7jIkcmcqcOpXVX6f0nldPHB07BInMSNqwc=", "L37PfaPZTHUPG7g2P6tJjit+NAnpOD7KsusxpOgEYDg=", "EkFGL+REqMnoqzo0uGo/2iGcLdRMH1CmfxisoeExiww=", "8DmZgdyRJ0IPvLWPFHpdy3lqj2m/67Y+NJ4YwB7Ewxk=", "yQGoBtfrFX/w4lR1NfC6F6gie7N+FEW6Sh5p5OzUXKg=", "R5ahhm4sKIdAE4mI4RQi3RkPeawUNPkfjgK5Fyzp4Z0=", "/Qw7iFc3uQ+zjLyuEvXGwWaz8QliIu703Z+//2cVIWc="];
  }
  _log(step, message, data = null) {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    console.log(`[${timestamp}] [${step.toUpperCase()}] ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
  _encState(obj) {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
  }
  _decState(stateStr) {
    if (!stateStr) return null;
    try {
      return JSON.parse(Buffer.from(stateStr, "base64").toString("utf-8"));
    } catch (e) {
      return null;
    }
  }
  _genTag() {
    const ms = Date.now();
    const rand4 = String(Math.floor(Math.random() * 1e4)).padStart(4, "0");
    const plain = `[insmelo]_${ms}_${rand4}`;
    const keyWA = CryptoJS.enc.Base64.parse(this.keys[Math.floor(Math.random() * this.keys.length)]);
    return CryptoJS.AES.encrypt(plain, keyWA, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString(CryptoJS.enc.Base64);
  }
  _getHeaders(session = null) {
    const h = {
      "Content-Type": "application/json",
      sys: "insmelo",
      clientType: "android",
      version: "1.0.0",
      "time-zone": "UTC+07:00",
      tag: this._genTag(),
      ...SpoofHead()
    };
    if (session?.token) {
      h["token"] = session.token;
      h["userId"] = String(session.userId);
      h["Authorization"] = `Bearer ${session.token}`;
    }
    return h;
  }
  async _ensureSession(state) {
    let session = this._decState(state);
    if (!session) {
      this._log("auth", "State tidak ditemukan. Memulai Auto-Login...");
      const deviceId = `InsMelo_${CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex)}`;
      try {
        const res = await axios.post(`${this.baseUrl}/api/insmelo/user/loginByDevice`, {
          deviceId: deviceId
        }, {
          headers: this._getHeaders()
        });
        const d = res.data?.data || res.data;
        session = {
          token: d.token || d.accessToken || d.token?.accessToken,
          userId: d.userId || d.id || d.user?.id,
          deviceId: deviceId
        };
        if (!session.token) throw new Error("Token tidak ditemukan di response login.");
        this._log("auth", `Auto-Login Berhasil! UserID: ${session.userId}`);
      } catch (err) {
        this._log("error", "Auto-Login Gagal total.", err.response?.data || err.message);
        throw err;
      }
    }
    return session;
  }
  async model({
    state = null
  }) {
    try {
      const session = await this._ensureSession(state);
      const res = await axios.post(`${this.baseUrl}/api/insmelo/info/model`, {}, {
        headers: this._getHeaders(session)
      });
      return {
        success: true,
        data: res.data?.data,
        state: this._encState(session)
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        state: state
      };
    }
  }
  async generate({
    state = null,
    prompt,
    style = "Cinematic",
    title = "New Song"
  }) {
    try {
      const session = await this._ensureSession(state);
      this._log("generate", `Memproses: "${prompt}"`);
      const res = await axios.post(`${this.baseUrl}/api/insmelo/generate`, {
        prompt: prompt,
        style: style,
        title: title,
        custom: false,
        instrumental: false,
        model: "chirp-v4-5",
        personaId: "chirp-v4-5",
        generateType: "DEFAULT"
      }, {
        headers: this._getHeaders(session)
      });
      this._log("generate", "Berhasil kirim request.");
      return {
        success: true,
        data: res.data?.data,
        state: this._encState(session)
      };
    } catch (err) {
      this._log("error", `Gagal di generate(): ${err.message}`);
      return {
        success: false,
        error: err.message,
        state: state
      };
    }
  }
  async status({
    state = null,
    page = 1
  }) {
    try {
      const session = await this._ensureSession(state);
      const res = await axios.get(`${this.baseUrl}/api/insmelo/info/page`, {
        params: {
          category: "all",
          page: page,
          size: 20
        },
        headers: this._getHeaders(session)
      });
      return {
        success: true,
        data: res.data?.data,
        state: this._encState(session)
      };
    } catch (err) {
      this._log("error", `Gagal di status(): ${err.message}`);
      return {
        success: false,
        error: err.message,
        state: state
      };
    }
  }
}
export default async function handler(req, res) {
  const {
    action,
    ...params
  } = req.method === "GET" ? req.query : req.body;
  const validActions = ["model", "generate", "status"];
  if (!action) {
    return res.status(400).json({
      status: false,
      error: "Parameter 'action' wajib diisi.",
      available_actions: validActions,
      usage: {
        method: "GET / POST",
        example: "/?action=model"
      }
    });
  }
  const api = new InsMelo();
  try {
    let response;
    switch (action) {
      case "model":
        response = await api.model(params);
        break;
      case "generate":
        if (!params.prompt) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'prompt' wajib diisi untuk action 'generate'."
          });
        }
        response = await api.generate(params);
        break;
      case "status":
        if (!params.state) {
          return res.status(400).json({
            status: false,
            error: "Parameter 'state' wajib diisi untuk action 'status'."
          });
        }
        response = await api.status(params);
        break;
      default:
        return res.status(400).json({
          status: false,
          error: `Action tidak valid: ${action}.`,
          valid_actions: validActions
        });
    }
    return res.status(200).json({
      status: true,
      action: action,
      ...response
    });
  } catch (error) {
    console.error(`[FATAL ERROR] Kegagalan pada action '${action}':`, error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan internal pada server.",
      error: error.message || "Unknown Error"
    });
  }
}