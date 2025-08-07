const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator'); // Import para validación

dotenv.config();
const logger = pino();
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint /register
router.post('/register', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    // Verificar si el email ya está registrado
    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      logger.warn(`Email already registered: ${req.body.email}`);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hashear la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    // Guardar nuevo usuario
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    // Crear payload JWT
    const payload = {
      user: {
        id: newUser.insertedId.toString(),
      },
    };

    // Firmar token JWT
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User registered successfully: ${req.body.email}`);
    res.json({ authtoken, email: req.body.email, firstName: req.body.firstName });

  } catch (e) {
    logger.error('Internal server error', e);
    res.status(500).send('Internal server error');
  }
});

// Endpoint /login
router.post('/login', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    // Buscar usuario por email
    const theUser = await collection.findOne({ email: req.body.email });
    if (!theUser) {
      logger.warn(`User not found: ${req.body.email}`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar contraseña
    const passwordMatch = await bcryptjs.compare(req.body.password, theUser.password);
    if (!passwordMatch) {
      logger.warn(`Incorrect password attempt for: ${req.body.email}`);
      return res.status(404).json({ error: 'Wrong password' });
    }

    // Crear payload JWT
    const payload = {
      user: {
        id: theUser._id.toString(),
      },
    };

    // Firmar token JWT
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Enviar token y detalles del usuario
    res.json({ authtoken, userName: theUser.firstName, userEmail: theUser.email });

  } catch (e) {
    logger.error('Internal server error', e);
    res.status(500).send('Internal server error');
  }
});

// Endpoint /update
router.put('/update', 
  // Validación: aquí agregas campos que quieras validar, por ejemplo userName no vacío
  body('userName', 'El nombre no puede estar vacío').notEmpty(),
  async (req, res) => {
    // Validar inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userEmail = req.header('email');
      if (!userEmail) {
        return res.status(400).json({ error: 'El correo electrónico es obligatorio en los headers.' });
      }

      const db = await connectToDatabase();
      const collection = db.collection('users');

      // Buscar usuario por email
      const existingUser = await collection.findOne({ email: userEmail });
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      const { userName } = req.body;

      // Actualizar datos
      await collection.updateOne(
        { email: userEmail },
        { $set: { firstName: userName, updatedAt: new Date() } }
      );

      // Crear nuevo token JWT
      const payload = { user: { id: existingUser._id.toString() } };
      const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      res.json({ authtoken });
    } catch (e) {
      logger.error('Internal server error', e);
      res.status(500).send('Internal server error');
    }
  }
);

module.exports = router;
