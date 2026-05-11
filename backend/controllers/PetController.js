const Pet = require("../models/Pet");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const getToken = require("../helpers/get-tokens");
const getUserByToken = require("../helpers/get-user-by-token");
const { countDocuments } = require("../models/User");

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "O peso é Obrigatório!" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é Obrigatória!" });
      return;
    }

    if (!req.files || req.files.lenght === 0) {
      res.status(4220).json({ message: "A imagem é obrigatória!" });
    }

    const image = req.files.map((file) => file.filename);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      image: image,
      available: true,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({
        massage: "Pet cadastrado com sucesso!",
        pet: newPet,
      });
    } catch (error) {
      res.status(500).json({ massage: error });
    }
  }
};
