import { dataStore } from "../services/dataStore.js";
import { Product } from "../models/Product.js";

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await dataStore.getCategories();
    
    // Attach live product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat.name });
        return {
          ...cat,
          productCount: count
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching categories: " + error.message
    });
  }
};

// POST /api/categories (Admin)
export const createCategory = async (req, res) => {
  try {
    const { name, description, color, order } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required."
      });
    }

    const created = await dataStore.createCategory({
      name: name.trim(),
      description: description || "",
      color: color || "",
      order: typeof order === "number" ? order : 0
    });

    res.status(201).json({
      success: true,
      message: `Category "${created.name}" created successfully.`,
      data: {
        ...created.toObject(),
        productCount: 0
      }
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Could not create category."
    });
  }
};

// PUT /api/categories/:id (Admin)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, order } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required."
      });
    }

    const updated = await dataStore.updateCategory(id, {
      name: name.trim(),
      description: description !== undefined ? description.trim() : "",
      color: color || "",
      order: typeof order === "number" ? order : 0
    });

    const productCount = await Product.countDocuments({ category: updated.name });

    res.json({
      success: true,
      message: `Category "${updated.name}" updated successfully.`,
      data: {
        ...updated,
        productCount
      }
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Could not update category."
    });
  }
};

// DELETE /api/categories/:id (Admin)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await dataStore.getCategoryById(id);
    if (!cat) {
      return res.status(404).json({
        success: false,
        message: "Category not found."
      });
    }

    const assignedCount = await Product.countDocuments({ category: cat.name });

    await dataStore.deleteCategory(id);

    res.json({
      success: true,
      message: `Category "${cat.name}" deleted successfully.`,
      assignedProductsCount: assignedCount
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Could not delete category."
    });
  }
};
