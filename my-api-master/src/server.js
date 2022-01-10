const express = require("express");
const morgan = require("morgan");
const fs = require("fs"); // file system
const path = require("path");
const { title } = require("process");

const Joi = require("joi");
const { defaultMaxListeners } = require("events");

const pathProductsJSON = path.join(__dirname, "./data/products.json");

const products = JSON.parse(fs.readFileSync(pathProductsJSON).toString()); // string json --> objet js

const app = express();

app.use(express.json());

app.use(morgan("combined"));

app.get("", (req, res) => {
  // res==>response
  console.log("requête entrante sur la homepage");
  res.send("Homepage");
});

app.get("/products", (req, res) => {
  res.status(200).send(products);
});

app.post("/products", (req, res) => {
  const product = req.body;

  product.id = products[products.length - 1].id + 1;

  products.push(product);

  res.status(201).send(products);
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Listenning on port 3000...")
);

app.delete("/api/products/:id", (req, res) => {
  
  const id = parseInt(req.params.id);

  const product = products.find((product) => {
    return product.id === id
  })

  if(!product) {
    return res.status(404).send(`Product with id = ${id} does not exist!`)
  }
  const idx = products.indexOf(product)
  products.splice(idx, 1)
  res.status(200).send(product)
  
})

app.put("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((product) => {
    return product.id === id
  })

  if(!product) {
    return res.status(404).send(`Product with id = ${id} does not exist!`)
  }

  const schema = Joi.object({
    // "id": joi.number().integer().min(1),
    title: Joi.string(),
    price: Joi.number(),
    description: Joi.string(),
    category: Joi.string(),
    image: Joi.string(),
    rating: {
        rate: Joi.number(),
        count: Joi.number()
    }
  })

  const { error } = schema.validate(body);

  if(error) {
    res.status(400).send(`Bad Request!\n${error.details[0].message}`)
  }
  
  for(let property in req.body) {
    product[property] = req.body[property]
  }

  res.status(200).send(product);


})


app.get("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const product = products.find((product) => {
    return product.id === id
  })

  if(!product) {
    return res.status(404).send(`Product with id = ${id} does not exist!`)
  }
  res.status(200).send(product)
  
}) 