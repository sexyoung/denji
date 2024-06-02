// src/server.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 創建用戶
app.post("/users", async (req, res) => {
  const { pk, username } = req.body;
  console.log(pk, username);
  
  const user = await prisma.user.upsert({
    where: {pk_user_unique: { pk, username }},
    create: { pk, username },
    update: { createdAt: new Date() },
  });
  res.json(user);
});

// 獲取所有用戶
// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// 創建封鎖
app.post("/blocks", async (req, res) => {
  const { userId, blockUsernames } = req.body;

  await Promise.all(blockUsernames.map((item: string) => 
    prisma.block.upsert({
      where: { user_block_unique: {userId, blockUsername: item} },
      update: { createdAt: new Date() },
      create: {userId, blockUsername: item},
    })
  ));

  res.json(true);
});

// 獲取所有封鎖
// app.get("/blocks", async (req, res) => {
//   const blocks = await prisma.block.findMany();
//   res.json(blocks);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
