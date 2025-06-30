const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Підключення до SQLite бази (файл database.db у папці server)
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Помилка підключення до бази:', err.message);
  } else {
    console.log('Підключено до SQLite бази.');
  }
});

// Створення таблиць, якщо їх немає
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    images TEXT,  -- збережемо JSON-масив як текст
    created_at TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
  )`);
});

// Маршрут для отримання відгуків з коментарями
app.get('/reviews', (req, res) => {
  db.all(`SELECT * FROM reviews ORDER BY datetime(created_at) DESC`, [], (err, reviews) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Парсимо images з рядка JSON до масиву
    reviews = reviews.map(r => ({
      ...r,
      images: r.images ? JSON.parse(r.images) : []
    }));

    // Отримаємо коментарі для кожного відгуку
    const reviewIds = reviews.map(r => r.id);
    if (reviewIds.length === 0) {
      res.json([]);
      return;
    }

    db.all(
      `SELECT * FROM comments WHERE review_id IN (${reviewIds.join(',')}) ORDER BY datetime(created_at) ASC`,
      [],
      (err, comments) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Привʼязуємо коментарі до відгуків
        const commentsByReview = {};
        comments.forEach(c => {
          if (!commentsByReview[c.review_id]) commentsByReview[c.review_id] = [];
          commentsByReview[c.review_id].push(c);
        });

        const result = reviews.map(r => ({
          ...r,
          comments: commentsByReview[r.id] || []
        }));

        res.json(result);
      }
    );
  });
});

// Додати відгук
app.post('/reviews', (req, res) => {
  const { name, text, images, created_at } = req.body;
  if (!name || !text || !created_at) {
    res.status(400).json({ error: 'Відсутні обовʼязкові поля' });
    return;
  }

  const imagesStr = JSON.stringify(images || []);

  db.run(
    `INSERT INTO reviews (name, text, images, created_at) VALUES (?, ?, ?, ?)`,
    [name, text, imagesStr, created_at],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Видалити відгук
app.delete('/reviews/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM reviews WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Додати коментар
app.post('/comments', (req, res) => {
  const { review_id, author_name, content, created_at } = req.body;
  if (!review_id || !author_name || !content || !created_at) {
    res.status(400).json({ error: 'Відсутні обовʼязкові поля' });
    return;
  }

  db.run(
    `INSERT INTO comments (review_id, author_name, content, created_at) VALUES (?, ?, ?, ?)`,
    [review_id, author_name, content, created_at],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
