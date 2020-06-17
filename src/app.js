const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json());
app.use(cors());
const repositories = [];

function validateRepositorioId(request, response, next){
  const { id } = request.params;
  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid porject ID.'});
  }
  return next();
}

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url , techs, likes } = request.body;
  const repositorio = { id: uuid(), title, url, techs, likes }
  repositories.push(repositorio);
  return response.json(repositorio)
});

app.put("/repositories/:id", validateRepositorioId, (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;
    const index = repositories.findIndex(repositorio => repositorio.id == id);
    if(index < 0){
      return response.status(400).json({ error: 'Repositoriy Not Found.'})
    }

    const { likes } = repositories[index];
    const repositorio = {
      id,
      title,
      url,
      techs,
      likes
    }
    repositories[index] = repositorio
     return response.json(repositorio);
});

app.delete("/repositories/:id", validateRepositorioId, (request, response) => {
   const { id } = request.params;
   const index = repositories.findIndex(repositorio => repositorio.id == id)
   if(index < 0){
     return response.status(400).json({ error: 'Repository Not Found.'})
   }
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    const index = repositories.findIndex(repositorio => repositorio.id == id)
    if(index < 0){
      return response.status(400).json({ error: 'Repository Not Found.'})
    }
    repositories[index].likes += 1;
    return response.json(repositories[index])
});

module.exports = app;
