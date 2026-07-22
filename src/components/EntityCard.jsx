import { useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const IMG_BASE = "https://starwars-visualguide.com/assets/img";

const imgFor = (category, uid) => {
  const folder =
    category === "people"
      ? "characters"
      : category === "vehicles"
      ? "vehicles"
      : "planets";
  return `${IMG_BASE}/${folder}/${uid}.jpg`;
};

// Placeholder fiable con el nombre de la entidad (funciona siempre).
const placeholderFor = (name) =>
  `https://placehold.co/400x300/1a1a1a/FFE81F?text=${encodeURIComponent(name)}`;

export const EntityCard = ({ item }) => {
  const { store, dispatch } = useGlobalReducer();
  const [imgSrc, setImgSrc] = useState(imgFor(item.category, item.uid));

  const isFavorite = store.favorites.some(
    (f) => f.uid === item.uid && f.category === item.category
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch({
        type: "remove_favorite",
        payload: { uid: item.uid, category: item.category },
      });
    } else {
      dispatch({
        type: "add_favorite",
        payload: { uid: item.uid, name: item.name, category: item.category },
      });
    }
  };

  return (
    <div className="card shadow-sm border-0" style={{ minWidth: 280, maxWidth: 280 }}>
      <img
        src={imgSrc}
        // Si la imagen de visualguide falla, cae al placeholder con el nombre.
        onError={() => setImgSrc(placeholderFor(item.name))}
        alt={item.name}
        className="card-img-top"
        style={{ height: 200, objectFit: "cover", background: "#e9ecef" }}
      />
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link
            to={`/single/${item.category}/${item.uid}`}
            className="btn btn-outline-primary btn-sm"
          >
            Learn more!
          </Link>
          <button
            className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
            onClick={toggleFavorite}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
};