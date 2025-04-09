const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Add root route
app.get('/', (req, res) => {
  res.send('Welcome to the API server! Available endpoints: /api/files, /api/save, /api/load, /api/delete');
});

app.get('/api/files', (req, res) => {
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  res.json(files);
});

app.post('/api/save', (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  res.json({ message: 'File saved successfully' });
});

app.get('/api/load', (req, res) => {
  const { filename } = req.query;
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json(content);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.delete('/api/delete', (req, res) => {
  const { filename } = req.query;
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ API server is running on http://localhost:${port}`);
});