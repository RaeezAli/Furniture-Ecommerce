import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Image as ImageIcon,
  AlertTriangle,
  X,
  Download,
} from "lucide-react";
import { nanoid } from "nanoid";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { Button } from "../../components/common/Button";
import { exportToExcel } from "../../utils/exportToExcel";

const CLOUD_NAME = "dabzehltj";
const UPLOAD_PRESET = "furniro_preset";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "furniture_products");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url;
};

/* ── Skeleton shimmer ── */
const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{
      background: "linear-gradient(90deg,#F4F5F7 25%,#E5E7EB 50%,#F4F5F7 75%)",
      backgroundSize: "200% 100%",
    }}
  />
);

const Products = () => {
  const { loading, addDocument, updateDocument, deleteDocument } =
    useFirestore();
  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    isNew: false,
    isFeatured: false,
  });

  // Image upload state
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
        setPageLoading(false);
        setFetchError(null);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setFetchError("Failed to load products. Please try again.");
        setPageLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = p.name || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.id || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        isNew: !!product.isNew,
        isFeatured: !!product.isFeatured,
      });
      setImages(product.images || (product.imageUrl ? [product.imageUrl] : []));
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        isNew: false,
        isFeatured: false,
      });
      setImages([]);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remaining = 6 - images.length;
    const filesToUpload = files.slice(0, remaining);

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        filesToUpload.map((file) => uploadToCloudinary(file)),
      );
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      showToast("Image upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    if (uploading) {
      showToast("Please wait for images to finish uploading.", "error");
      return;
    }

    if (!formData.name || !formData.category || !formData.price) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one product image.", "error");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: images,
      imageUrl: images[0] || "",
      updatedAt: new Date(),
    };

    let success;
    if (editingProduct) {
      success = await updateDocument("products", editingProduct.id, payload);
    } else {
      success = await addDocument("products", {
        ...payload,
        internalId: nanoid(8).toUpperCase(),
        createdAt: new Date(),
      });
    }

    if (success) {
      showToast(editingProduct ? "Product updated." : "Product added.");
      setImages([]);
      setIsModalOpen(false);
    } else {
      showToast("Failed to save product.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const success = await deleteDocument("products", productToDelete.id);
    if (success) {
      showToast("Product deleted.");
      setIsDeleteModalOpen(false);
    } else {
      showToast("Failed to delete product.", "error");
    }
  };

  const getProductImage = (product) =>
    (product.images && product.images[0]) || product.image || null;

  const handleExport = () => {
    const data = filteredProducts.map((p) => ({
      name: p.name || "",
      category: p.category || "",
      price: p.price || 0,
      stock: p.stock ?? 0,
      isFeatured: p.isFeatured ? "Yes" : "No",
      isNew: p.isNew ? "Yes" : "No",
      isActive: p.isActive !== false ? "Yes" : "No",
    }));
    exportToExcel(
      data,
      [
        { label: "Product Name", key: "name" },
        { label: "Category", key: "category" },
        { label: "Price", key: "price" },
        { label: "Stock", key: "stock" },
        { label: "Featured", key: "isFeatured" },
        { label: "New", key: "isNew" },
        { label: "Active", key: "isActive" },
      ],
      "products",
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#333333]">Products</h1>
          <p className="text-[#898989] text-[13px]">
            Manage your furniture catalog and inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={filteredProducts.length === 0}
            className="border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export Excel
          </button>
          <Button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 text-[13px] py-2 px-4"
          >
            <Plus size={14} />
            Add Product
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-[#FCEBEB] border border-[#E24B4A] rounded-lg p-4 text-[13px] text-[#A32D2D]">
          {fetchError}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg p-3 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]"
            size={16}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 h-[40px] border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-[40px] px-3 border border-[#D1D5DB] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] appearance-none bg-white min-w-[150px]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="px-4 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[40%]">
                  Product
                </th>
                <th className="px-4 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[15%]">
                  Category
                </th>
                <th className="px-4 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[12%]">
                  Price
                </th>
                <th className="px-4 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%]">
                  Stock
                </th>
                <th className="px-4 py-3 text-[11px] font-[500] text-[#898989] uppercase tracking-wider w-[10%] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4">
                      <div className="flex gap-3 items-center">
                        <Shimmer className="w-10 h-10 flex-shrink-0" />
                        <div className="space-y-2">
                          <Shimmer className="h-4 w-32" />
                          <Shimmer className="h-3 w-48" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Shimmer className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-4">
                      <Shimmer className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <Shimmer className="h-4 w-12" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Shimmer className="w-8 h-8 rounded-lg" />
                        <Shimmer className="w-8 h-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Package
                      size={48}
                      className="mx-auto text-[#D1D5DB] mb-3 opacity-20"
                    />
                    <p className="text-[14px] font-medium text-[#898989]">
                      No products found
                    </p>
                    <button
                      onClick={() => handleOpenModal()}
                      className="text-[#B88E2F] text-[13px] font-semibold mt-2 hover:underline"
                    >
                      Add your first product
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#FCF8F3] transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F4F5F7] border border-[#E5E7EB] overflow-hidden flex-shrink-0">
                          {getProductImage(product) ? (
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[300px]">
                          <p className="text-[14px] font-semibold text-[#333333] truncate">
                            {product.name}
                          </p>
                          <p className="text-[12px] text-[#898989] line-clamp-1">
                            {product.description || "No description provided."}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[13px] text-[#616161]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[14px] font-bold text-[#333333]">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${product.stock <= 5 ? "bg-red-500" : "bg-[#2EC1AC]"}`}
                        ></div>
                        <span
                          className={`text-[13px] ${product.stock <= 5 ? "text-red-500 font-semibold" : "text-[#616161]"}`}
                        >
                          {product.stock} in stock
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-[#898989] hover:text-[#B88E2F] hover:bg-white rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-[#898989] hover:text-[#E24B4A] hover:bg-white rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add/Edit Product */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setImages([]);
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        width="600px"
        confirmText={editingProduct ? "Save Changes" : "Create Product"}
        onConfirm={handleSave}
        loading={loading || uploading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[12px] font-medium text-[#616161]">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full h-[45px] px-3 border border-[#D1D5DB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
              placeholder="e.g. Luxury Velvet Sofa"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#616161]">
              Category *
            </label>
            <input
              type="text"
              list="categories-list"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full h-[45px] px-3 border border-[#D1D5DB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
              placeholder="e.g. Living Room"
            />
            <datalist id="categories-list">
              {categories
                .filter((c) => c !== "All")
                .map((c) => (
                  <option key={c} value={c} />
                ))}
            </datalist>
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#616161]">
              Price (Rs.) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full h-[45px] px-3 border border-[#D1D5DB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
              placeholder="e.g. 45000"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#616161]">
              Initial Stock Quantity
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full h-[45px] px-3 border border-[#D1D5DB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#B88E2F]"
              placeholder="e.g. 10"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[12px] font-medium text-[#616161] block mb-2">
              Product Images{" "}
              <span className="text-[#9F9F9F]">
                (first image = main, max 6)
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E7EB]"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-[#B88E2F] text-white text-[9px] text-center py-0.5">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < 6 && (
                <label
                  className={`w-20 h-20 rounded-lg border border-dashed border-[#D1D5DB] flex flex-col items-center justify-center cursor-pointer hover:border-[#B88E2F] transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-[#B88E2F] text-xl">+</span>
                      <span className="text-[9px] text-[#9F9F9F] mt-1">
                        Add Image
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[12px] font-medium text-[#616161]">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border border-[#D1D5DB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#B88E2F] resize-none"
              placeholder="Provide a detailed description of the product..."
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) =>
                  setFormData({ ...formData, isNew: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#D1D5DB] text-[#B88E2F] focus:ring-[#B88E2F]"
              />
              <span className="text-[13px] text-[#616161] group-hover:text-[#333333]">
                Mark as New
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4 rounded border-[#D1D5DB] text-[#B88E2F] focus:ring-[#B88E2F]"
              />
              <span className="text-[13px] text-[#616161] group-hover:text-[#333333]">
                Feature on Homepage
              </span>
            </label>
          </div>
        </div>
      </Modal>

      {/* MODAL: Delete Confirmation */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product?"
        width="360px"
        type="danger"
        confirmText="Delete Product"
        onConfirm={confirmDelete}
        loading={loading}
      >
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 mx-auto flex items-center justify-center">
            <AlertTriangle size={40} className="text-[#EF9F27]" />
          </div>
          <div>
            <h4 className="text-[16px] font-semibold text-[#333333] mb-1">
              Are you sure?
            </h4>
            <p className="text-[13px] text-[#616161]">
              <span className="font-bold text-[#333333]">
                {productToDelete?.name}
              </span>{" "}
              will be permanently removed from the catalog. This action cannot
              be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
