const Pet = require("../models/Pet");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const getToken = require("../helpers/get-tokens");
const getUserByToken = require("../helpers/get-user-by-token");
const { countDocuments } = require("../models/User");
const getUserToken = require("../helpers/get-user-by-token");

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
  static async getAll(req, res) {
    try {
      const pets = await Pet.find().sort("-createdAt");
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ massage: error });
    }
  }
  static async getAllUsersByPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const pets = await Pet.find({ "adopter._id": adopter._id }).sort(
        "-createdAt",
      );
      res.statu(200).json({ pets });
    } catch (error) {
      res.status(500).json({ massage: error });
    }
  }
};
