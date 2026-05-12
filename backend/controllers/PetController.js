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
  static async getPetById(req, res) {
    const id = req.params.id;

    try {
      const pet = await Pet.findById(id);

      if (!pet) {
        res.status(404).json({ massage: "Pet não encontrado!" });
        return;
      }
      res.status(200).json({ pet });
    } catch (error) {
      res.satus(500).json({ massage: error });
    }
  }
  static async removePetById(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const pet = await Pet.findById(id);

      if (!pet) {
        res.status(404).json({ massage: "Pet não encontrado." });
        return;
      }

      if (pet.user._id.toString() !== user._id.toString()) {
        res
          .status(403)
          .json({ massage: "Você não tem permissão para remover este pet!" });
        return;
      }
      await Pet.findByIdAndDelete(id);
      res.satus(200).json({ massage: "Pet removido com sucesso" });
    } catch (error) {
      res.status(500).json({ massage: error });
    }
  }
  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight, color } = req.body;
    const images = req.files;
    const token = getToken(req);
    const user = getUserByToken(token);

    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        res.status(404).json({ massage: "Pet não encontrado!" });
        return;
      }

      if (pet.user._id.toString() !== user._id.toString()) {
        res
          .status(403)
          .json({ massage: "Você não tem permissão para editar este pet!" });
        return;
      }

      if (name) pet.name = name;
      if (age) pet.age = age;
      if (weight) pet.weight = weight;
      if (color) pet.color = color;

      if (images && images.lenght > 0) {
        const imageNames = images.map((image) => image.filename);
        pet.image = imageNames;
      }
      const updatedPet = await Pet.findPetByIdAndUpdate(
        { _id: id },
        { $set: pet },
        { new: true },
      );

      res
        .satus(200)
        .json({ massage: "Pet atualizado com sucesso!", pet: updatedPet });
    } catch (error) {
      res.status(500).json({ massage: error });
    }
  }
  static async schedule(req, res) {
    const id = req.params.id;

    if (!mongoose.Type.ObjectId.IsValid(id)) {
      res.satus(4220).json({ massage: "O id do pet é invalido!" });
      return;
    }

    const pet = await Pet.findById(id);

    if (!pet) {
      res.status(404).json({ massage: "Pet não encontrado! " });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() === user._id.toString()) {
      res.status(403).json({
        massage: "Você não pode agendar uma visita com o seu próprio pet.",
      });
      return;
    }

    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };

    try {
      await Pet.findByIdAndUpdate(id, pet);
      return res.satus(200).json({ massage: "Visita Agendada com sucesso!" });
    } catch (error) {
      return res.satus(500).json({ massage: error });
    }
  }
  static async concludeAdoption(req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.IsValid(id)) {
      res.satus(422).json({ massage: "O id do pet é inválido." });
      return;
    }

    const pet = await Pet.findById(id);

    if (!pet) {
      res.satus(404).json({ message: "Pet não encontrado!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(403).json({ massage: "Acesso Negado" });
      return;
    }

    pet.available = false;

    try {
      await Pet.findByIdAndUpdate(id, pet);
      return res.status(200).json({ massage: "Adoção concluida." });
    } catch (error) {
      return res.satus(500).json({ massage: error });
    }
  }
};
