const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const port = 3001;
app.listen(port, () => { console.log(`Server running on http://localhost:${port}`) });


let users = [
  {id: 1, name: "Burak", email:"burakgundogan@gmail.com"},
  {id: 2, name: "Nuri", email:"nurigundogan@gmail.com"},
]

app.get('/api/users', (req, res) => {res.json(users);});

app.put('/api/users/:id', (req, res) => {const user = users.find(u => u.id ===parseInt(req.params.id));
  if(!user) {
    return res.status(404).send("Kullanici Bulunamadi.");
  }

  if(req.body.name) {
    user.name = req.body.name;
  };

  if(req.body.email) {
    user.email = req.body.email;
  };

  res.json(users);
});

app.post('/api/users', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const newUser = {id: users.length + 1, name, email};
  users.push(newUser);
  res.status(201).send(newUser);
});

app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id)); 
  if (userIndex === -1) { 
    return res.status(404).send("Kullanıcı Bulunamadı.");
  }
  users.splice(userIndex, 1); 
  res.send({ message: 'Kullanıcı Silindi.' });
});