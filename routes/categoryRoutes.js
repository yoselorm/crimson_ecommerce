const express = require('express');
const categoryRouter = express.Router();
const isAdmin = require('../middlewares/adminCheck');
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');

categoryRouter.post('/categories',isAdmin, createCategory);
categoryRouter.get('/categories', getAllCategories);
categoryRouter.put('/categories/:id',isAdmin, updateCategory);
categoryRouter.delete('/categories/:id',isAdmin, deleteCategory);

module.exports = categoryRouter;
