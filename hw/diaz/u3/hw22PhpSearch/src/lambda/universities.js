const fs = require("fs/promises");
const path = require("path");

const HIPOLABS_BASE_URL = "http://universities.hipolabs.com/search";
const ROOT_DIR = path.resolve(__dirname, "../..");
const FRONTEND_API_URL = "/universities";

const fileCache = new Map();

const buildResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify(payload)
});

const normalizeCountry = (country) => {
  const countryValue = typeof country === "string" ? country.trim() : "";
  return countryValue.length > 0 ? countryValue : "";
};

const mapUniversity = (university) => ({
  name: university?.name ?? "",
  country: university?.country ?? "",
  domain: university?.domains?.[0] ?? "",
  webPage: university?.web_pages?.[0] ?? ""
});

const readTextFile = async (fileName) => {
  if (!fileCache.has(fileName)) {
    const filePath = path.join(ROOT_DIR, fileName);
    fileCache.set(fileName, fs.readFile(filePath, "utf8"));
  }

  return fileCache.get(fileName);
};

const buildFrontendHtml = async () => {
  const source = await readTextFile("index.php");

  return source
    .replace(/<\?php[\s\S]*?\?>\s*/m, "")
    .replace(/data-api-url="[^"]*"/, `data-api-url="${FRONTEND_API_URL}"`)
    .replace(/style\.css/g, "style.css?v=2")
    .replace(/functions\.js/g, "functions.js?v=2");
};

const buildFrontendResponse = (contentType, body) => ({
  statusCode: 200,
  headers: {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*"
  },
  body
});

const buildStaticFileResponse = async (fileName, contentType) =>
  buildFrontendResponse(contentType, await readTextFile(fileName));

const handler = async (event) => {
  try {
    const rawPath = event?.rawPath || "/";

    if (rawPath === "/" || rawPath === "/index.php") {
      return buildFrontendResponse("text/html; charset=utf-8", await buildFrontendHtml());
    }

    if (rawPath === "/style.css") {
      return buildStaticFileResponse("style.css", "text/css; charset=utf-8");
    }

    if (rawPath === "/functions.js") {
      return buildStaticFileResponse("functions.js", "application/javascript; charset=utf-8");
    }

    if (rawPath !== "/universities" && rawPath !== "/universities/") {
      return buildFrontendResponse(
        "text/plain; charset=utf-8",
        "Not found"
      );
    }

    const country = normalizeCountry(event?.queryStringParameters?.country);
    const requestUrl = country
      ? `${HIPOLABS_BASE_URL}?country=${encodeURIComponent(country)}`
      : `${HIPOLABS_BASE_URL}`;
    const response = await fetch(requestUrl);

    if (!response.ok) {
      return buildResponse(502, { message: "Upstream service is unavailable" });
    }

    const universities = await response.json();
    const result = universities.map(mapUniversity);

    return buildResponse(200, {
      country: country || "All",
      total: result.length,
      data: result
    });
  } catch {
    return buildResponse(500, { message: "Internal server error" });
  }
};

module.exports = { handler };
