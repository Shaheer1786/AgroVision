import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";


import mongoose from "mongoose";
import dotenv from "dotenv";

import Scan from "./models/Scan.js";
import OpenAI from "openai";

dotenv.config();

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});


const app = express();

app.use(cors());
app.use(express.json());

/* ==========================
   MongoDB Connection
========================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:");
    console.error(err);
  });

/* ==========================
   Multer Upload
========================== */

const upload = multer({
  dest: "uploads/"
});

/* ==========================
   Signup
========================== */
app.post("/signup", async (req, res) => {

  console.log("================================");
  console.log("SIGNUP ROUTE HIT");
  console.log(req.body);
  console.log("================================");

  try {

    const {
      name,
      email,
      password
    } = req.body;

    // rest of your code...

    const existingUser =
      await User.findOne({
        email
      });

    if (existingUser) {

      return res.status(400).json({
        error: "Email already exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword

      });

    const token =
      jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.json({

      success: true,

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Signup failed"
    });

  }

});


/* ==========================
   Login
========================== */

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      return res.status(400).json({
        error: "User not found"
      });

    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {

      return res.status(400).json({
        error: "Invalid password"
      });

    }

    const token =
      jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.json({

  success: true,

  token,

 user: {

  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role

}
});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Login failed"
    });

  }

});

/* ==========================
   Prediction Route
========================== */
/* ==========================
   Prediction Route
========================== */

app.post(
  "/predict",
  upload.single("image"),
  async (req, res) => {

    try {

      console.log("Received Image");

      const formData = new FormData();

      formData.append(
        "image",
        fs.createReadStream(req.file.path)
      );

      const response = await axios.post(
        "http://127.0.0.1:5001/predict",
        formData,
        {
          headers: formData.getHeaders()
        }
      );

      const prediction = response.data;

      console.log("===============");
      console.log("AI RESPONSE");
      console.log(prediction);
      console.log("===============");
      const savedScan =
        await Scan.create({

          crop:
            prediction.disease.split("/")[0],

          disease:
            prediction.disease,

          confidence:
            prediction.confidence,

          imageName:
            req.file.filename

        })
        
      console.log("Saved To MongoDB");
      console.log(savedScan);

      res.json(prediction);

    } catch (err) {

      console.error("Prediction Error:");
      console.error(err);

      res.status(500).json({
        error: "Prediction failed"
      });

    }

  }
);
/* ==========================
   Get History
/* ==========================
   Get History
========================== */

app.get(
  "/history",
  async (req, res) => {

    try {

      const scans =
        await Scan.find()
          .sort({
            createdAt: -1
          });

      res.json(scans);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

app.delete(
  "/admin/clear-history",
  async (req, res) => {

    try {

      await Scan.deleteMany({});

      res.json({
        success: true
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);


/* ==========================
   Test Route
========================== */

app.get("/", (req, res) => {

  res.json({
    message: "AgroVision Backend Running"
  });

});
/* ==========================
   Gemini Farmer AI Chat
========================== */
app.post("/chat", async (req, res) => {

  try {
    

    const { message, language } = req.body;


    const completion =
      await openrouter.chat.completions.create({

       model:
  "google/gemma-3-12b-it",

  temperature: 0.2,
max_tokens: 150,

        messages: [

         {
  role: "system",
  content:
    language === "ur"
      ? `
آپ کسان ڈاکٹر اے آئی ہیں۔

صرف اردو میں جواب دیں۔

فارمیٹ:

وجہ:
- ...

علاج:
- ...

بچاؤ:
- ...

قواعد:
- صرف اردو
- کوئی انگریزی نہیں
- زیادہ سے زیادہ 60 الفاظ
- مختصر جواب
- صرف زرعی معلومات
`
      : `
You are AgroVision AI.

Answer only in English.

Format:

Cause:
- ...

Treatment:
- ...

Prevention:
- ...

Rules:
- Maximum 60 words
- Simple language
- Short answer



Topics:
- Wheat diseases
- Rice diseases
- Cotton diseases
- Fertilizers
- Irrigation
- Pest management
- Soil health
- Weather impact on crops
If the user asks for a crop care plan:

Provide:

Day 1:
- action

Day 3:
- action

Day 5:
- action

Day 7:
- action

Keep recommendations practical, simple and farmer-friendly.

اگر صارف فصلی منصوبہ مانگے تو:

دن 1:
- ...

دن 3:
- ...

دن 5:
- ...

دن 7:
- ...

سادہ اور عملی مشورے دیں۔
`
          },

          {
            role: "user",
            content: message
          }

        ]

      });

    const reply =
      completion.choices[0]
      .message.content;

      

    res.json({
      reply
    });

  } catch (err) {

    console.error(
      "OpenRouter Error:"
    );

    console.error(err);

    res.status(500).json({
      error: "Chat failed"
    });

  }

});
/* ==========================
   Start Server
========================== */


/* ==========================
   Dashboard Stats
========================== */

app.get("/stats", async (req, res) => {

  try {

    const totalScans =
      await Scan.countDocuments();

    const healthyScans =
      await Scan.countDocuments({
        disease: {
          $regex: "Healthy",
          $options: "i"
        }
      });

    const diseasedScans =
      totalScans - healthyScans;

    res.json({

      totalScans,

      healthyScans,

      diseasedScans

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.delete("/history/:id", async (req, res) => {

  try {

    await Scan.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

app.delete("/history", async (req, res) => {

  try {

    await Scan.deleteMany({});

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});



app.get("/ai-test", async (req, res) => {

  try {

    const completion =
      await openrouter.chat.completions.create({

        model:
          "meta-llama/llama-3.1-8b-instruct",

        messages: [
          {
            role: "user",
            content: "Say hello"
          }
        ]

      });

    res.json({
      reply:
        completion.choices[0]
        .message.content
    });

  } catch (err) {

    res.status(500).json(err);

  }


});


const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Node server running on port ${PORT}`
  );

});


app.get("/weather/:city", async (req, res) => {

  try {

    const city = req.params.city;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.json(response.data);

  } catch (err) {

    res.status(500).json({
      error: "Weather fetch failed"
    });

  }

});

app.get("/test-key", (req, res) => {
  res.json({
    keyPrefix:
      process.env.GEMINI_API_KEY?.substring(0, 10)
  });
});

app.get("/admin/users", async (req, res) => {

  try {

    const users = await User.find(
      {},
      {
        password: 0
      }
    );

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch users"
    });

  }

});

app.get("/admin/users", async (req, res) => {

  try {

    const users = await User.find(
      {},
      {
        password: 0
      }
    );

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch users"
    });

  }

});


app.get("/admin/user-count", async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    res.json({
      totalUsers
    });

  } catch (err) {

    res.status(500).json({
      error: "Failed"
    });

  }

});