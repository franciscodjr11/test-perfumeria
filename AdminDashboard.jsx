// src/components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { db, storage } from '../../firebase/config'; // Tu configuración de Firebase
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const AdminDashboard = ({ onLogout, products, onDeleteProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Comercial',
    price: '',
    stock: '',
    description: '',
    imageFile: null,
    imagePreview: ''
  });

  const [uploading, setUploading] = useState(false);

  // 1. Capturar la foto seleccionada desde el teléfono o PC
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file) // Vista previa local inmediata
      });
    }
  };

  // 2. Subir foto al servidor y guardar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.imageFile) {
      alert('Por favor completa el nombre, precio y selecciona una foto.');
      return;
    }

    try {
      setUploading(true);

      // A) Subir el archivo directamente a Firebase Storage (Servidor)
      const storageRef = ref(storage, `products/${Date.now()}_${formData.imageFile.name}`);
      await uploadBytes(storageRef, formData.imageFile);
      
      // B) Obtener la URL pública que generó el servidor automáticamente
      const firebaseImageUrl = await getDownloadURL(storageRef);

      // C) Guardar el producto en la base de datos (Firestore)
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        image: firebaseImageUrl, // URL generada por el servidor
        createdAt: new Date()
      });

      alert('¡Producto y foto subidos con éxito al servidor!');

      // Limpiar el formulario
      setFormData({
        name: '',
        category: 'Comercial',
        price: '',
        stock: '',
        description: '',
        imageFile: null,
        imagePreview: ''
      });
    } catch (error) {
      console.error('Error al subir el producto:', error);
      alert('Hubo un error al guardar el producto.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h2>Panel de Administración</h2>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </header>

      <div className="dashboard-grid">
        <div className="card-form-container">
          <h3>Agregar Nueva Fragancia</h3>
          
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Nombre del Perfume</label>
              <input 
                type="text" 
                placeholder="Ej. Bleu de Chanel EDP"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Comercial">Comercial</option>
                  <option value="Árabe">Árabe</option>
                  <option value="Nicho">Nicho</option>
                  <option value="Original">Original</option>
                </select>
              </div>

              <div className="form-group">
                <label>Precio ($)</label>
                <input 
                  type="number" 
                  placeholder="Ej. 120"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Stock / Existencias</label>
              <input 
                type="number" 
                min="0"
                placeholder="Ej. 5"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea 
                rows="3"
                placeholder="Notas olfativas, presentación, etc."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Selector de Archivo de Foto Directo */}
            <div className="form-group">
              <label>Foto de la Fragancia (Galería / Cámara)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {formData.imagePreview && (
                <div className="image-preview-box">
                  <p>Vista previa:</p>
                  <img src={formData.imagePreview} alt="Previsualización" />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-submit-product"
              disabled={uploading}
            >
              {uploading ? 'Subiendo foto al servidor...' : 'Guardar Producto'}
            </button>
          </form>
        </div>

        {/* Lista de Productos */}
        <div className="card-products-list">
          <h3>Productos en el Catálogo ({products.length})</h3>
          <div className="admin-products-scroll">
            {products.map(product => (
              <div key={product.id} className="admin-product-item">
                <img src={product.image} alt={product.name} />
                <div className="admin-product-info">
                  <h4>{product.name}</h4>
                  <span className="badge">{product.category}</span>
                  <p className="price">${product.price}</p>
                </div>
                <button 
                  onClick={() => onDeleteProduct(product.id)}
                  className="btn-delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};