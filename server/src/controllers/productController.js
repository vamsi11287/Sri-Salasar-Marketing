import { dataStore } from "../services/dataStore.js";
import { deleteFromCloudinary, extractPublicIdFromCloudinaryUrl } from "../services/cloudinary.js";

const getImageUrls = (product) => Array.from(new Set([
  ...(Array.isArray(product.images) ? product.images : []),
  product.image
].filter(Boolean)));

const removeProductImage = async (imageUrl, publicId = "") => {
  if (publicId) {
    await deleteFromCloudinary(publicId, "image");
  } else if (imageUrl && imageUrl.includes("cloudinary.com")) {
    const extractedPublicId = extractPublicIdFromCloudinaryUrl(imageUrl);
    if (extractedPublicId) await deleteFromCloudinary(extractedPublicId, "image");
  }
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, type, size, color, search, status } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    let products = await dataStore.getProducts(filter);

    // Filter by category or type
    const catFilter = category || type;
    if (catFilter && catFilter !== "All Products") {
      products = products.filter(p => p.category?.toLowerCase() === catFilter.toLowerCase());
    }

    // Filter by size
    if (size && size !== "All Sizes") {
      products = products.filter(p => {
        if (!p.sizes && (!p.sizeChart || p.sizeChart.length === 0)) return false;
        const sizeStr = (p.sizes || "").toLowerCase();
        const hasInChart = p.sizeChart?.some(row => 
          row.length?.toLowerCase().includes(size.toLowerCase()) || 
          `${row.length}x${row.width}`.toLowerCase().includes(size.toLowerCase())
        );
        return sizeStr.includes(size.toLowerCase()) || hasInChart;
      });
    }

    // Filter by color
    if (color && color !== "All Colours") {
      products = products.filter(p => {
        if (!p.colors || p.colors.length === 0) return false;
        return p.colors.some(c => c.toLowerCase().includes(color.toLowerCase()));
      });
    }

    // Filter by keyword search
    if (search && search.trim() !== "") {
      const q = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.detail?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error fetching products" });
  }
};

// GET /api/products/filter-options (Client Requirement #3: Type, Size, Colour)
export const getFilterOptions = async (req, res) => {
  try {
    const products = await dataStore.getProducts();
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    
    // Extract sizes
    const sizeSet = new Set();
    products.forEach(p => {
      if (p.sizes) {
        p.sizes.split(",").forEach(s => sizeSet.add(s.trim()));
      }
      if (p.sizeChart) {
        p.sizeChart.forEach(row => {
          if (row.length) sizeSet.add(row.length.trim());
        });
      }
    });

    // Extract colors
    const colorSet = new Set();
    products.forEach(p => {
      if (Array.isArray(p.colors)) {
        p.colors.forEach(c => colorSet.add(c.trim()));
      }
    });

    res.json({
      success: true,
      data: {
        types: ["All Products", ...categories],
        sizes: ["All Sizes", ...Array.from(sizeSet)],
        colors: ["All Colours", ...Array.from(colorSet)]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading filter options" });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await dataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product details" });
  }
};

// POST /api/products (Admin)
export const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    data.images = Array.isArray(data.images) ? data.images : (data.image ? [data.image] : []);
    data.image = data.images[0] || data.image || "";
    if (data.image && data.image.includes("cloudinary.com") && !data.cloudinaryPublicId) {
      const extracted = extractPublicIdFromCloudinaryUrl(data.image);
      if (extracted) data.cloudinaryPublicId = extracted;
    }
    const product = await dataStore.createProduct(data);
    res.status(201).json({ success: true, message: "Product added successfully", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

// PUT /api/products/:id (Admin: update price, specs, etc.)
export const updateProduct = async (req, res) => {
  try {
    const existing = await dataStore.getProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found to update" });
    }

    const updates = { ...req.body };
    if (Array.isArray(updates.images)) {
      updates.images = Array.from(new Set(updates.images.filter(Boolean)));
      updates.image = updates.images[0] || "";
      const retainedImages = new Set(getImageUrls(updates));
      for (const oldImage of getImageUrls(existing)) {
        if (!retainedImages.has(oldImage)) {
          const publicIdToDel = extractPublicIdFromCloudinaryUrl(oldImage) || (oldImage === existing.image ? existing.cloudinaryPublicId : "");
          await removeProductImage(oldImage, publicIdToDel);
        }
      }
    } else if (updates.image && updates.image !== existing.image) {
      const publicIdToDel = extractPublicIdFromCloudinaryUrl(existing.image) || existing.cloudinaryPublicId;
      await removeProductImage(existing.image, publicIdToDel);
      updates.images = [updates.image];
    }

    if (updates.image && updates.image.includes("cloudinary.com")) {
      const extracted = extractPublicIdFromCloudinaryUrl(updates.image);
      if (extracted) updates.cloudinaryPublicId = extracted;
    } else if (!updates.image) {
      updates.cloudinaryPublicId = "";
    }

    const updated = await dataStore.updateProduct(req.params.id, updates);
    res.json({ success: true, message: "Product updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// POST /api/products/delete-image (Admin: deletes specific image from Cloudinary and updates product in Atlas)
export const deleteProductImage = async (req, res) => {
  try {
    const { imageUrl, publicId, productId } = req.body;
    if (!imageUrl && !publicId) {
      return res.status(400).json({ success: false, message: "imageUrl or publicId is required" });
    }

    const targetPublicId = publicId || (imageUrl ? extractPublicIdFromCloudinaryUrl(imageUrl) : "");
    let cloudinaryResult = null;
    if (targetPublicId) {
      cloudinaryResult = await deleteFromCloudinary(targetPublicId, "image");
    }

    let updatedProduct = null;
    if (productId) {
      const existing = await dataStore.getProductById(productId);
      if (existing) {
        const remainingImages = (Array.isArray(existing.images) ? existing.images : [])
          .filter(img => img !== imageUrl && (!targetPublicId || !img.includes(targetPublicId)));
        
        const newPrimaryImage = remainingImages[0] || "";
        const newPublicId = newPrimaryImage ? (extractPublicIdFromCloudinaryUrl(newPrimaryImage) || "") : "";

        updatedProduct = await dataStore.updateProduct(productId, {
          images: remainingImages,
          image: newPrimaryImage,
          cloudinaryPublicId: newPublicId
        });
      }
    }

    res.json({
      success: true,
      message: "Image successfully deleted from Cloudinary" + (updatedProduct ? " and product updated" : ""),
      data: updatedProduct,
      cloudinary: cloudinaryResult
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({ success: false, message: "Error deleting image: " + error.message });
  }
};

// DELETE /api/products/:id (Admin: deletes product and removes all associated images from Cloudinary)
export const deleteProduct = async (req, res) => {
  try {
    const product = await dataStore.getProductById(req.params.id);

    if (product) {
      for (const imageUrl of getImageUrls(product)) {
        const publicIdToDel = extractPublicIdFromCloudinaryUrl(imageUrl) || (imageUrl === product.image ? product.cloudinaryPublicId : "");
        await removeProductImage(imageUrl, publicIdToDel);
      }
    }

    await dataStore.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product and associated Cloudinary images deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};
