import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

//ผู้ใช้งานสามารถสร้างคำถามได้
questionRouter.post('/api/questions', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const question = new Question({ title, description, category });
    await question.save();
    res.status(201).json({ message: 'Question posted successfully', question });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะดูคำถามทั้งหมดได้
questionRouter.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะดูคำถามแต่ละอันได้ ด้วย Id ของคำถามได้
questionRouter.get('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะแก้ไขหัวข้อ หรือคำอธิบายของคำถามได้
questionRouter.put('/api/questions/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const question = await Question.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะลบคำถามได้
questionRouter.delete('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    await Answer.deleteMany({ questionId: req.params.id });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
questionRouter.post('/api/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const answer = new Answer({ questionId, content });
    await answer.save();
    res.status(201).json({ message: 'Answer posted successfully', answer });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถสร้างคำตอบของคำถามนั้นได้
questionRouter.get('/api/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ questionId });
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะลบคำถามได้
questionRouter.delete('/api/answers/:id', async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) {
      res.status(404).json({ error: 'Answer not found' });
      return;
    }
    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
questionRouter.get('/api/questions/search', async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, 'i'); // Case-insensitive search
    const questions = await Question.find({
      $or: [{ title: regex }, { category: regex }],
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถสร้างคำตอบของคำถามนั้นได้
questionRouter.post('/api/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const answer = new Answer({ questionId, content });
    await answer.save();
    res.status(201).json({ message: 'Answer posted successfully', answer });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะดูคำตอบของคำถามแต่ละอันได้
questionRouter.get('/api/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ questionId });
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถที่จะลบคำถามได้
questionRouter.delete('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }
    await Answer.deleteMany({ questionId: req.params.id });
    await question.remove();
    res.status(200).json({ message: 'Question and its answers deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//ผู้ใช้งานสามารถกดเห็นด้วยหรือไม่เห็นด้วยกับคำถามได้ด้วยเช่นกัน
questionRouter.post('/api/answers/:id/vote', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      res.status(404).json({ error: 'Answer not found' });
      return;
    }
    const { vote } = req.body;
    if (vote === 'up') {
      answer.upvotes += 1;
    } else if (vote === 'down') {
      answer.downvotes += 1;
    } else {
      res.status(400).json({ error: 'Invalid vote type' });
      return;
    }
    await answer.save();
    res.status(200).json({ message: 'Vote recorded successfully', answer });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default questionRouter;