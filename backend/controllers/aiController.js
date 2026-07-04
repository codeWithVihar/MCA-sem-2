const AI_BASE = process.env.AI_BASE || "http://localhost:8000";

const proxyGet = async (req, res, endpoint) => {
  try {
    const response = await fetch(`${AI_BASE}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      return res.status(response.status).json({ message: "AI service error" });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`AI proxy error (${endpoint}):`, error.message);
    res.status(503).json({ message: "AI service unavailable", fallback: true });
  }
};

exports.getDashboard = async (req, res) => {
  await proxyGet(req, res, "/dashboard");
};

exports.getDemandForecast = async (req, res) => {
  await proxyGet(req, res, "/demand-forecast");
};

exports.getSalesPrediction = async (req, res) => {
  await proxyGet(req, res, "/sales-prediction");
};

exports.getRestock = async (req, res) => {
  await proxyGet(req, res, "/restock");
};

exports.getStockout = async (req, res) => {
  await proxyGet(req, res, "/stockout");
};

exports.getProfit = async (req, res) => {
  await proxyGet(req, res, "/profit");
};

exports.getFastMoving = async (req, res) => {
  await proxyGet(req, res, "/fast-moving");
};

exports.getSupplier = async (req, res) => {
  await proxyGet(req, res, "/supplier");
};

exports.train = async (req, res) => {
  try {
    const response = await fetch(`${AI_BASE}/train`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(120000),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("AI train error:", error.message);
    res.status(503).json({ message: "AI service unavailable" });
  }
};
