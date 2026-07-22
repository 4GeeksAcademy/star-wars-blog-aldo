import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const API = "https://www.swapi.tech/api";
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


const placeholderFor = (name) =>
  `https://placehold.co/600x600/1a1a1a/FFE81F?text=${encodeURIComponent(name)}`;


const FIELDS = {
  people: [
    ["Gender", "gender"],
    ["Birth Year", "birth_year"],
    ["Height", "height"],
    ["Mass", "mass"],
    ["Hair Color", "hair_color"],
    ["Skin Color", "skin_color"],
    ["Eye Color", "eye_color"],
  ],
  vehicles: [
    ["Model", "model"],
    ["Manufacturer", "manufacturer"],
    ["Class", "vehicle_class"],
    ["Cost (créditos)", "cost_in_credits"],
    ["Length", "length"],
    ["Crew", "crew"],
    ["Passengers", "passengers"],
    ["Max Speed", "max_atmosphering_speed"],
  ],
  planets: [
    ["Climate", "climate"],
    ["Terrain", "terrain"],
    ["Population", "population"],
    ["Diameter", "diameter"],
    ["Gravity", "gravity"],
    ["Orbital Period", "orbital_period"],
    ["Rotation Period", "rotation_period"],
  ],
};

export const Single = () => {
  const { category, theId } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(null);

  const cacheKey = `${category}/${theId}`;

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      // Usa la caché del store si ya existe
      if (store.details[cacheKey]) {
        setProperties(store.details[cacheKey]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/${category}/${theId}`);
        const data = await res.json();
        const props = data?.result?.properties || {};
        setProperties(props);
        dispatch({ type: "set_detail", payload: { key: cacheKey, data: props } });
      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [category, theId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-3 text-secondary">Cargando datos de la galaxia…</p>
      </div>
    );
  }

  const name = properties?.name || "Desconocido";
  const uid = theId;
  const isFavorite = store.favorites.some(
    (f) => f.uid === uid && f.category === category
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch({ type: "remove_favorite", payload: { uid, category } });
    } else {
      dispatch({ type: "add_favorite", payload: { uid, name, category } });
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-center">
        <div className="col-md-5">
          <img
            src={imgSrc || imgFor(category, uid)}
            onError={() => setImgSrc(placeholderFor(name))}
            alt={name}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-7">
          <h1 className="text-uppercase fw-bold" style={{ letterSpacing: "2px" }}>
            {name}
          </h1>
          <table className="table table-striped mt-3">
            <tbody>
              {(FIELDS[category] || []).map(([label, key]) => (
                <tr key={key}>
                  <th style={{ width: "45%" }}>{label}</th>
                  <td className="text-capitalize">{properties?.[key] ?? "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex gap-2 mt-4">
            <button
              className={`btn ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? "♥ En favoritos" : "♡ Guardar"}
            </button>
            <Link to="/" className="btn btn-secondary">
              ← Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};