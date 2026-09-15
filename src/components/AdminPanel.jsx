import { useState } from 'react';
import { getFirebaseStorage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import './AdminPanel.css';

const emptyProduct = {
  name: '',
  brand: '',
  category: 'Damas',
  price: '',
  stock: '',
  topNotes: '',
  imageFile: null,
  imagePreview: '',
  image: '',
};

export default function AdminPanel({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [form, setForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (event) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) return;

    setForm((currentForm) => ({
      ...currentForm,
      imageFile,
      imagePreview: URL.createObjectURL(imageFile),
    }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.price || (!editingProductId && !form.imageFile)) {
      setError(editingProductId ? 'Completa el nombre y el precio del producto.' : 'Completa el nombre, precio y selecciona una foto.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      let image = form.image;
      if (form.imageFile) {
        const storage = getFirebaseStorage();
        const filePath = `products/${crypto.randomUUID()}-${form.imageFile.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, form.imageFile);
        image = await getDownloadURL(storageRef);
      }

      const productData = { ...form };
      delete productData.imageFile;
      delete productData.imagePreview;
      const product = {
        ...productData,
        image,
        id: editingProductId || crypto.randomUUID(),
        price: Number(form.price),
        stock: Number(form.stock),
        rating: form.rating ?? 5,
        description: form.description || `Fragancia ${form.brand} ${form.name}`,
        heartNotes: form.heartNotes ?? '',
        baseNotes: form.baseNotes ?? '',
        isBestSeller: form.isBestSeller ?? false,
      };

      if (editingProductId) {
        onUpdateProduct(product);
      } else {
        onAddProduct(product);
      }
      setForm(emptyProduct);
      setEditingProductId(null);
    } catch (uploadError) {
      console.error('Error al subir la imagen:', uploadError);
      setError('No se pudo subir la imagen. Revisa la configuración y las reglas de Firebase.');
    } finally {
      setUploading(false);
    }
  };

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleEdit = (product) => {
    setForm({
      ...emptyProduct,
      ...product,
      stock: product.stock ?? 0,
      imagePreview: product.image,
      imageFile: null,
    });
    setEditingProductId(product.id);
    setError('');
  };

  const handleCancelEdit = () => {
    setForm(emptyProduct);
    setEditingProductId(null);
    setError('');
  };

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="admin-eyebrow">Administración</span>
          <h2>Gestionar catálogo</h2>
        </div>
        <span>{products.length} productos</span>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={updateField} required />
        <input name="brand" placeholder="Marca" value={form.brand} onChange={updateField} required />
        <select name="category" value={form.category} onChange={updateField}>
          <option>Damas</option>
          <option>Caballeros</option>
          <option>Unisex</option>
        </select>
        <input name="price" type="number" min="0" step="0.01" placeholder="Precio" value={form.price} onChange={updateField} required />
        <input name="stock" type="number" min="0" placeholder="Existencias" value={form.stock} onChange={updateField} required />
        <label className="admin-file-field">
          Foto del producto
          <input name="imageFile" type="file" accept="image/*" onChange={handleImageChange} required={!editingProductId} />
        </label>
        {form.imagePreview && (
          <img className="admin-image-preview" src={form.imagePreview} alt="Vista previa del producto" />
        )}
        <input name="topNotes" placeholder="Notas principales" value={form.topNotes} onChange={updateField} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Subiendo imagen...' : editingProductId ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {editingProductId && (
          <button type="button" onClick={handleCancelEdit} disabled={uploading}>
            Cancelar edición
          </button>
        )}
      </form>
      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-product-list">
        {products.map((product) => (
          <div className="admin-product-row" key={product.id}>
            <span>{product.name} <small>{product.brand}</small></span>
            <div className="admin-product-actions">
              <button type="button" onClick={() => handleEdit(product)}>
                Editar
              </button>
              <button type="button" onClick={() => onDeleteProduct(product.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AdminLoginModal({ onClose, onLogin }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-login-modal" onClick={(event) => event.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <span className="admin-eyebrow">Acceso privado</span>
        <h2>Panel de administración</h2>
        <p>Inicia sesión para gestionar los productos del catálogo.</p>
        <button className="google-login-button" onClick={onLogin}>
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
