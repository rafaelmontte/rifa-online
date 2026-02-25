require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const routes = require('./routes/routes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

/* CONEXÃO COM O BANCO DE DADOS */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err)
);

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
