const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());          // dopušta pozive iz preglednika (npr. s frontenda)
app.use(express.json());

// Pohrana u memoriji: podaci se brišu kad se servis ponovno pokrene
const tasks = new Map();
let nextId = 1;

// Provjera i čišćenje ulaza za POST i PUT
function parseTask(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (title.length < 1 || title.length > 120) {
    return { error: "title mora imati 1 do 120 znakova" };
  }
  if (body.done !== undefined && typeof body.done !== "boolean") {
    return { error: "done mora biti true ili false" };
  }
  return { value: { title, done: body.done ?? false } };
}

app.get("/", (req, res) => {
  res.json({ name: "Zadaci API", health: "/health", tasks: "/tasks" });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/tasks", (req, res) => {
  let items = [...tasks.values()];
  if (req.query.done === "true") items = items.filter((t) => t.done);
  if (req.query.done === "false") items = items.filter((t) => !t.done);
  res.json(items);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.get(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Zadatak ne postoji" });
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { value, error } = parseTask(req.body);
  if (error) return res.status(422).json({ error });
  const task = { id: nextId++, ...value };
  tasks.set(task.id, task);
  res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!tasks.has(id)) return res.status(404).json({ error: "Zadatak ne postoji" });
  const { value, error } = parseTask(req.body);
  if (error) return res.status(422).json({ error });
  const task = { id, ...value };
  tasks.set(id, task);
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  if (!tasks.delete(Number(req.params.id))) {
    return res.status(404).json({ error: "Zadatak ne postoji" });
  }
  res.status(204).end();
});

// Neispravan JSON u tijelu zahtjeva
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Neispravan JSON" });
  }
  res.status(500).json({ error: "Greška na serveru" });
});

// Render postavlja PORT, lokalno koristimo 3000
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`API radi na portu ${port}`));
