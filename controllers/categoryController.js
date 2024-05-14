const Category = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
