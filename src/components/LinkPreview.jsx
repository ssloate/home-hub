import { useState, useEffect } from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import './LinkPreview.css';

export default function LinkPreview({ url, title, onPreviewLoaded }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`http://localhost:3001/api/link-preview?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.success && data.data.image) {
          setPreview(data.data);
          if (onPreviewLoaded) {
            onPreviewLoaded(data.data);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url, onPreviewLoaded]);

  if (loading) {
    return (
      <div className="link-preview loading">
        <div className="link-preview-placeholder">
          <div className="loading-shimmer"></div>
        </div>
      </div>
    );
  }

  if (error || !preview?.image) {
    return (
      <div className="link-preview no-image">
        <div className="link-preview-fallback">
          <ImageIcon size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="link-preview">
      <a href={url} target="_blank" rel="noopener noreferrer" className="link-preview-image">
        <img
          src={preview.image}
          alt={preview.title || title || 'Link preview'}
          onError={() => setError(true)}
        />
        <div className="link-preview-overlay">
          <ExternalLink size={16} />
        </div>
      </a>
    </div>
  );
}
