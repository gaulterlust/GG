import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'GreenGard');
  const cloudName = 'dhnz29x4f';

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
};

function Reviews() {
  const { isAdmin } = useContext(AdminContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', text: '', images: [] });
  const [commentTexts, setCommentTexts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [ads, setAds] = useState({
    left: '/ads/left.jpg',
    right: '/ads/right.jpg',
    bottomMobile: '/ads/bottom-mobile.jpg',
  });
  const [editingAds, setEditingAds] = useState(false);

  // Завантаження реклами
  useEffect(() => {
    const stored = localStorage.getItem('ads');
    if (stored) setAds(JSON.parse(stored));
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:4000/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - newReview.images.length);
    const newImages = files.map(file => URL.createObjectURL(file));
    setNewReview(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const handleAdChange = async (position, file) => {
    const uploadedUrl = await uploadToCloudinary(file);
    if (!uploadedUrl) return;
    setAds(prev => {
      const updated = { ...prev, [position]: uploadedUrl };
      localStorage.setItem('ads', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddReview = async () => {
    if (!newReview.name.trim() || !newReview.text.trim()) return;

    const uploadedImages = [];
    for (const img of newReview.images) {
      if (img.startsWith('blob:')) {
        const file = await fetch(img).then(r => r.blob());
        const url = await uploadToCloudinary(file);
        if (url) uploadedImages.push(url);
      } else {
        uploadedImages.push(img);
      }
    }

    const reviewToSave = {
      name: newReview.name,
      text: newReview.text,
      images: uploadedImages,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:4000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewToSave),
      });
      if (res.ok) {
        setNewReview({ name: '', text: '', images: [] });
        setShowForm(false);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      const res = await fetch(`http://localhost:4000/reviews/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleAddComment = async (reviewId) => {
    const text = commentTexts[reviewId]?.trim();
    if (!text) return;

    const commentToSave = {
      review_id: reviewId,
      author_name: newReview.name || 'Гість',
      content: text,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:4000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentToSave),
      });
      if (res.ok) {
        setCommentTexts(prev => ({ ...prev, [reviewId]: '' }));
        fetchReviews();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer" onClick={() => setFullscreenImage(null)}>
          <img src={fullscreenImage} alt="Full" className="max-w-full max-h-full rounded shadow-xl" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="hidden lg:block">
          <div className="bg-white rounded shadow p-2">
            <img src={ads.left} alt="Реклама зліва" className="w-full h-auto rounded" />
            {isAdmin && editingAds && (
              <input type="file" accept="image/*,video/*" onChange={(e) => handleAdChange('left', e.target.files[0])} className="mt-2" />
            )}
          </div>
        </div>

        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-center mb-6">Відгуки</h2>

          {isAdmin && (
            <div className="text-center mb-4">
              <button onClick={() => setEditingAds(!editingAds)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                {editingAds ? 'Сховати зміну реклами' : 'Змінити рекламу'}
              </button>
            </div>
          )}

          {!showForm && (
            <div className="text-center mb-6">
              <button onClick={() => setShowForm(true)} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
                Залишити відгук
              </button>
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded shadow p-4 mb-6">
              <input type="text" placeholder="Ваше ім’я" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} className="w-full border rounded p-2 mb-2" />
              <textarea placeholder="Напишіть ваш відгук..." value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} className="w-full border rounded p-2 mb-2" rows={3}></textarea>
              <div className="flex items-center gap-2 mb-2">
                <label className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center cursor-pointer">
                  📷
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <span className="text-sm text-gray-600">Макс. 10 фото</span>
              </div>
              <div className="flex gap-2 flex-wrap mb-2">
                {newReview.images.map((img, i) => (
                  <img key={i} src={img} alt={`img-${i}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddReview} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Додати</button>
                <button onClick={() => setShowForm(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Скасувати</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500">Ще немає відгуків.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white rounded shadow p-4">
                  <p className="font-bold">{review.name}</p>
                  <p className="mb-2">{review.text}</p>
                  {review.images?.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt={`img-${i}`} className="w-full max-h-[400px] object-contain rounded shadow cursor-zoom-in" onClick={() => setFullscreenImage(img)} />
                      ))}
                    </div>
                  )}
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold mb-2">Відповіді:</h3>
                    {review.comments?.length === 0 && <p className="text-gray-500 mb-2">Поки немає відповідей.</p>}
                    {review.comments?.map((comment) => (
                      <div key={comment.id} className="mb-2 border p-2 rounded bg-gray-50">
                        <p className="font-semibold">{comment.author_name || 'Користувач'}</p>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input type="text" placeholder="Напишіть відповідь..." value={commentTexts[review.id] || ''} onChange={(e) => setCommentTexts(prev => ({ ...prev, [review.id]: e.target.value }))} className="flex-grow border rounded p-1" />
                      <button onClick={() => handleAddComment(review.id)} className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">Відповісти</button>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="mt-2">
                      <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:underline text-sm">Видалити</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="lg:hidden mt-4">
            <img src={ads.bottomMobile} alt="Реклама для моб." className="w-full h-auto rounded shadow" />
            {isAdmin && editingAds && (
              <input type="file" accept="image/*,video/*" onChange={(e) => handleAdChange('bottomMobile', e.target.files[0])} className="mt-2" />
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="bg-white rounded shadow p-2">
            <img src={ads.right} alt="Реклама справа" className="w-full h-auto rounded" />
            {isAdmin && editingAds && (
              <input type="file" accept="image/*,video/*" onChange={(e) => handleAdChange('right', e.target.files[0])} className="mt-2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
