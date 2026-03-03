import axios from "axios";
import * as cheerio from "cheerio";
import FormData from "form-data";
class TextEffect {
  constructor() {
    this.base = null;
    this.cookie = "";
    this.maxRetry = 3;
    this.client = null;
  }
  initClient(url) {
    this.base = new URL(url).origin;
    if (this.client) return;
    const GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
    this.client = axios.create({
      baseURL: this.base,
      timeout: 6e4,
      headers: {
        "user-agent": GOOGLEBOT_UA,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        connection: "keep-alive"
      }
    });
  }
  saveCookie(headers) {
    const sc = headers?.["set-cookie"];
    if (sc?.length) this.cookie = sc.map(c => c.split(";")[0]).join("; ");
  }
  parseInputs($) {
    const inputs = [];
    $('input[name="text[]"]').each((i, el) => {
      const id = $(el).attr("id") ?? `text-${i}`;
      const label = $(`label[for="${id}"]`).text().replace("*", "").trim() || `text-${i}`;
      const placeholder = $(el).attr("placeholder") ?? "";
      inputs.push({
        index: i,
        id: id,
        label: label,
        placeholder: placeholder
      });
    });
    return inputs;
  }
  padTexts(text, inputs) {
    const total = inputs?.length ?? 1;
    let arr = Array.isArray(text) ? [...text] : [text ?? ""];
    while (arr.length < total) arr.push("");
    arr = arr.slice(0, total);
    console.log(`[text] total input: ${total} | values:`, arr);
    return arr;
  }
  async request(opts) {
    for (let i = 0; i < this.maxRetry; i++) {
      try {
        console.log(`[request] ${opts.method} ${opts.url}`);
        const res = await this.client.request({
          ...opts,
          headers: {
            ...this.cookie ? {
              cookie: this.cookie
            } : {},
            ...opts.headers ?? {}
          }
        });
        this.saveCookie(res.headers);
        return res.data;
      } catch (err) {
        const msg = err?.response?.data ?? err?.message ?? "Unknown error";
        if (i === this.maxRetry - 1) throw new Error(msg);
        const delay = Math.pow(2, i) * 1e3;
        console.log(`[request] retry ${i + 1} in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  async fetchPage(url) {
    console.log("[fetchPage] GET", url);
    const data = await this.request({
      method: "GET",
      url: url,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    console.log("[fetchPage] cookie:", this.cookie || "none");
    const $ = cheerio.load(data);
    const id = url.match(/(\d+)\.html/)?.[1] ?? null;
    const token = $("input#token").first().val() ?? null;
    const buildServer = $("input#build_server").first().val() ?? this.base;
    const buildServerId = $("input#build_server_id").first().val() ?? "1";
    const inputs = this.parseInputs($);
    console.log(`[fetchPage] id: ${id} | total input: ${inputs.length}`);
    inputs.forEach(inp => console.log(`  [${inp.index}] label: "${inp.label}" | placeholder: "${inp.placeholder}"`));
    return {
      id: id,
      token: token,
      buildServer: buildServer,
      buildServerId: buildServerId,
      inputs: inputs
    };
  }
  async submitForm(url, {
    token,
    buildServer,
    buildServerId,
    text,
    inputs
  }) {
    console.log("[submitForm] POST multipart", url);
    const texts = this.padTexts(text, inputs);
    const form = new FormData();
    texts.forEach(t => form.append("text[]", t));
    form.append("grecaptcharesponse", "");
    form.append("create_effect", "Go");
    form.append("token", token ?? "");
    form.append("build_server", buildServer ?? this.base);
    form.append("build_server_id", buildServerId ?? "1");
    const data = await this.request({
      method: "POST",
      url: url,
      data: form,
      headers: {
        ...form.getHeaders(),
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        origin: this.base,
        referer: url
      }
    });
    const $ = cheerio.load(data);
    const raw = $("#form_value").first().text()?.trim() ?? null;
    console.log("[submitForm] form_value:", raw?.slice(0, 80) ?? "not found");
    if (!raw) throw new Error("form_value not found");
    const fv = JSON.parse(raw);
    console.log("[submitForm] sign:", fv?.sign?.slice(0, 30) ?? "none");
    return fv;
  }
  async createImage(url, {
    id,
    token,
    sign,
    buildServer,
    buildServerId,
    text,
    inputs
  }) {
    const texts = this.padTexts(text, inputs);
    const payload = new URLSearchParams();
    payload.append("id", id ?? "");
    texts.forEach(t => payload.append("text[]", t));
    payload.append("grecaptcharesponse", "");
    payload.append("create_effect", "Go");
    payload.append("token", token ?? "");
    payload.append("build_server", buildServer ?? this.base);
    payload.append("build_server_id", buildServerId ?? "1");
    payload.append("sign", sign ?? "");
    console.log("[createImage] POST /effect/create-image | id:", id);
    const data = await this.request({
      method: "POST",
      url: `${this.base}/effect/create-image`,
      data: payload.toString(),
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
        accept: "*/*",
        origin: this.base,
        referer: url
      }
    });
    const result = typeof data === "string" ? JSON.parse(data) : data;
    console.log("[createImage] response:", JSON.stringify(result).slice(0, 120));
    return result;
  }
  async generate({
    text,
    url,
    ...rest
  }) {
    try {
      this.initClient(url);
      console.log("[generate] text:", text, "| url:", url);
      const page = await this.fetchPage(url);
      const fv = await this.submitForm(url, {
        ...page,
        text: text
      });
      const params = {
        id: fv?.id ?? page?.id,
        token: fv?.token ?? page?.token,
        sign: fv?.sign ?? null,
        buildServer: fv?.build_server ?? page?.buildServer,
        buildServerId: fv?.build_server_id ?? page?.buildServerId,
        text: fv?.text ?? (Array.isArray(text) ? text : [text]),
        inputs: page?.inputs,
        ...rest
      };
      const result = await this.createImage(url, params);
      if (!result?.success) throw new Error(result?.info ?? "Failed");
      const imgPath = result?.image ?? result?.fullsize_image ?? null;
      const imgUrl = imgPath ? `${params?.buildServer}${imgPath}` : null;
      console.log("[generate] done:", imgUrl);
      return {
        success: result?.success ?? false,
        url: imgUrl,
        code: result?.image_code ?? null,
        session: result?.session_id ?? null
      };
    } catch (err) {
      console.error("[generate] error:", err?.response?.data ?? err?.message ?? err);
      throw err;
    }
  }
}
export default async function handler(req, res) {
  const params = req.method === "GET" ? req.query : req.body;
  if (!params.text || !params.url) {
    return res.status(400).json({
      error: "Parameter 'text' dan 'url' diperlukan"
    });
  }
  const api = new TextEffect();
  try {
    const data = await api.generate(params);
    return res.status(200).json(data);
  } catch (error) {
    const errorMessage = error.message || "Terjadi kesalahan saat memproses URL";
    return res.status(500).json({
      error: errorMessage
    });
  }
}