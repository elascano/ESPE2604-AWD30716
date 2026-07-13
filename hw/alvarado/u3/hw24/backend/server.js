/**
 * Biconoirs Restaurant - Demo Backend
 * Topic: Non-blocking programming / Functional programming
 *
 * This server exposes 3 endpoints designed solely for demonstration purposes:
 *
 * GET /api/menu          -> NON-BLOCKING version (simulates a DB query using Promise + setTimeout)
 * GET /api/menu-blocking -> Intentionally BLOCKING version (synchronous busy-wait) for comparison
 * GET /api/ping          -> Instant response, used to test if the event loop remains free
 *
 * Live demo concept:
 * 1) /api/menu-blocking is requested and, almost simultaneously, 3 "pings".
 * Since the busy-wait blocks Node's SINGLE thread, the pings are queued
 * and take almost the same time as the menu request.
 * 2) /api/menu (non-blocking) is requested along with the same 3 pings.
 * Since the "wait" is handled via Promise/setTimeout (asynchronous I/O),
 * the thread remains free and the pings respond almost instantly.
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// For the demo, CORS is left open to any origin.
// In a real project, you would restrict `origin` to the frontend's IP/domain here.
app.use(cors());
app.use(express.json());

// --- In-memory "Database" ---
const menu = [
  { id: 1, name: "Shrimp ceviche", category: "Appetizers", price: 8.5, available: true },
  { id: 2, name: "Potato locro soup", category: "Appetizers", price: 6.0, available: true },
  { id: 3, name: "Encebollado fish stew", category: "Appetizers", price: 5.5, available: false },
  { id: 4, name: "Lomo saltado", category: "Mains", price: 12.0, available: true },
  { id: 5, name: "Seco de chivo (Goat stew)", category: "Mains", price: 11.0, available: true },
  { id: 6, name: "Fried corvina", category: "Mains", price: 14.5, available: false },
  { id: 7, name: "Tres leches cake", category: "Desserts", price: 4.0, available: true },
  { id: 8, name: "Coconut flan", category: "Desserts", price: 4.5, available: true },
];

const SIMULATED_DB_DELAY_MS = 2500;

// --- FUNCTIONAL: filtering only available items is a declarative operation, ---
// --- with no side effects: given the same `menu`, it always yields the same result ---
const onlyAvailable = (items) => items.filter((item) => item.available);

/**
 * Simulates a database query using a real Promise.
 * setTimeout does not occupy the main thread: it delegates it to the system (libuv),
 * leaving the event loop free to handle other requests in the meantime.
 */
function queryMenuNonBlocking() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(menu), SIMULATED_DB_DELAY_MS);
  });
}

/**
 * Intentionally INCORRECT: simulates the same wait but using a synchronous busy-wait.
 * This freezes Node's single thread during SIMULATED_DB_DELAY_MS,
 * meaning NO other request (not even /api/ping) can be served in the meantime.
 * It is left here solely to make the live comparison visible.
 */
function blockTheEventLoop(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // empty loop that keeps the main thread busy
  }
}

app.get("/api/menu", async (req, res) => {
  const items = await queryMenuNonBlocking();
  res.json({ mode: "non-blocking", items: onlyAvailable(items), servedAt: Date.now() });
});

app.get("/api/menu-blocking", (req, res) => {
  blockTheEventLoop(SIMULATED_DB_DELAY_MS);
  res.json({ mode: "blocking", items: onlyAvailable(menu), servedAt: Date.now() });
});

app.get("/api/ping", (req, res) => {
  res.json({ pong: true, servedAt: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Biconoirs demo backend listening on port ${PORT}`);
});
