// SERVEUR DE TEST UNIQUEMENT. Imite l'API d'embeddings avec des vecteurs déterministes
// (sac de mots hashé). Permet de tester le pipeline pgvector sans clé ni appel réseau.
// Ne donne aucune qualité sémantique réelle.
import { createServer } from "node:http";

const DIMENSIONS = 1536;

function embed(text) {
  const vector = new Array(DIMENSIONS).fill(0);
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  for (const word of words) {
    let hash = 0;
    for (const char of word) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    vector[hash % DIMENSIONS] += 1;
  }
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => value / norm);
}

createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200).end("ok");
    return;
  }
  if (request.method !== "POST" || request.url !== "/v1/embeddings") {
    response.writeHead(404).end();
    return;
  }
  let body = "";
  request.on("data", (chunk) => (body += chunk));
  request.on("end", () => {
    const { input } = JSON.parse(body);
    const data = input.map((text, index) => ({ index, embedding: embed(text) }));
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ data }));
  });
}).listen(3300, () => console.log("fake embeddings on 3300"));
