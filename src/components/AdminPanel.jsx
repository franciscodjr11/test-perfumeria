import { useState } from 'react';
import { getFirebaseStorage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import './AdminPanel.css';

const emptyProduct = {
  name: '',
  brand: '',
  category: 'Damas',
  price: '',
  topNotes: '',
  imageFile: null,
  imagePreview: '',
};

export default function AdminPanel({ products, onAddProduct, onDeleteProduct }) {
  const [form, setForm] = useState(emptyProduct);
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
    if (!form.imageFile) {
      setError('Selecciona una foto antes de agregar el producto.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const storage = getFirebaseStorage();
      const filePath = `products/${crypto.randomUUID()}-${form.imageFile.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, form.imageFile);
      const image = await getDownloadURL(storageRef);

      onAddProduct({
        ...form,
        image,
        id: crypto.randomUUID(),
        price: Number(form.price),
        rating: 5,
        description: `Fragancia ${form.brand} ${form.name}`,
        heartNotes: '',
        baseNotes: '',
        isBestSeller: false,
        imageFile: undefined,
        imagePreview: undefined,
      });
      setForm(emptyProduct);
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
        <label className="admin-file-field">
          Foto del producto
          <input name="imageFile" type="file" accept="image/*" onChange={handleImageChange} required />
        </label>
        {form.imagePreview && (
          <img className="admin-image-preview" src={form.imagePreview} alt="Vista previa del producto" />
        )}
        <input name="topNotes" placeholder="Notas principales" value={form.topNotes} onChange={updateField} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Subiendo imagen...' : 'Agregar producto'}
        </button>
      </form>
      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-product-list">
        {products.map((product) => (
          <div className="admin-product-row" key={product.id}>
            <span>{product.name} <small>{product.brand}</small></span>
            <button type="button" onClick={() => onDeleteProduct(product.id)}>
              Eliminar
            </button>
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
