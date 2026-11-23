// src/components/common/ImageUploader/ImageUploader.jsx
import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { storageService } from '../../../services/storageService';
import { toast } from '../../../utils/alerts';
import { UploadArea, LoadingOverlay } from './ImageUploader.styles';

export const ImageUploader = ({ businessId, kind = 'logo', aspect = 'square', currentUrl, onUploaded }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (!loading) inputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview temporal local
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);

    try {
      // 1. Borrar imagen anterior si existe
      if (currentUrl) await storageService.deleteImage(currentUrl);

      // 2. Subir nueva imagen
      const newUrl = await storageService.uploadBusinessImage(businessId, file, kind);
      
      // 3. Notificar al padre
      onUploaded(newUrl);
      setPreview(newUrl);
      toast.success('Imagen actualizada');
    } catch (err) {
      toast.error(err.message);
      setPreview(currentUrl); // Revertir en caso de error
    } finally {
      setLoading(false);
      URL.revokeObjectURL(objectUrl);
      e.target.value = ''; // Limpiar input
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <UploadArea $url={preview} $aspect={aspect} onClick={handleClick}>
        {loading && (
          <LoadingOverlay>
            <div className="spinner" />
            <span style={{ fontSize: '0.8rem' }}>Subiendo...</span>
          </LoadingOverlay>
        )}
        
        <div className="overlay">
          <div className="icon">
            {kind === 'logo' ? <ImageIcon size={24} /> : <Camera size={24} />}
          </div>
          <div className="text">
            {preview ? 'Cambiar imagen' : `Subir ${kind === 'logo' ? 'Logo' : 'Portada'}`}
          </div>
          {!preview && (
            <div className="hint">
              {aspect === 'square' ? '1:1 (Cuadrada)' : '16:6 (Panorámica)'}
            </div>
          )}
        </div>
      </UploadArea>
    </>
  );
};