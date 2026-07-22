import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const removeFavorite = (uid, category) => {
    dispatch({ type: "remove_favorite", payload: { uid, category } });
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm">
      <Link to="/" className="navbar-brand fw-bold" style={{ letterSpacing: "2px" }}>
        <span style={{ color: "#FFE81F" }}>STAR</span> WARS
      </Link>

      <div className="position-relative">
        <button
          className="btn btn-primary dropdown-toggle d-flex align-items-center gap-2"
          onClick={() => setOpen((o) => !o)}
        >
          Favorites
          <span className="badge bg-light text-dark">{store.favorites.length}</span>
        </button>

        {open && (
          <ul
            className="dropdown-menu show shadow end-0 mt-2 p-2"
            style={{ minWidth: 260, maxHeight: 320, overflowY: "auto" }}
          >
            {store.favorites.length === 0 ? (
              <li className="dropdown-item-text text-muted small">
                No hay favoritos todavía
              </li>
            ) : (
              store.favorites.map((f) => (
                <li
                  key={`${f.category}-${f.uid}`}
                  className="d-flex align-items-center justify-content-between px-2 py-1"
                >
                  <button
                    className="btn btn-link p-0 text-decoration-none text-truncate text-start"
                    style={{ maxWidth: 180 }}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/single/${f.category}/${f.uid}`);
                    }}
                  >
                    {f.name}
                  </button>
                  <button
                    className="btn btn-sm btn-link text-danger"
                    title="Quitar"
                    onClick={() => removeFavorite(f.uid, f.category)}
                  >
                    🗑
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};