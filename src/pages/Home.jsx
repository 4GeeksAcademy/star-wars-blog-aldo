import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { EntityCard } from "../components/EntityCard";

const API = "https://www.swapi.tech/api";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const loadCategory = async (category, type) => {
      try {
        const res = await fetch(`${API}/${category}?page=1&limit=10`);
        const data = await res.json();
        
        const items = (data.results || []).map((item) => ({
          uid: item.uid,
          name: item.name,
          category,
        }));
        dispatch({ type, payload: items });
      } catch (error) {
        console.error(`Error cargando ${category}:`, error);
      }
    };

    
    if (store.people.length === 0) loadCategory("people", "set_people");
    if (store.vehicles.length === 0) loadCategory("vehicles", "set_vehicles");
    if (store.planets.length === 0) loadCategory("planets", "set_planets");
  }, []);

  const Section = ({ title, items }) => (
    <div className="mb-5">
      <h2 className="text-warning fw-bold mb-3">{title}</h2>
      {items.length === 0 ? (
        <div className="d-flex align-items-center gap-2 text-secondary">
          <div className="spinner-border spinner-border-sm" role="status" />
          Cargando…
        </div>
      ) : (
        <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-3">
          {items.map((item) => (
            <EntityCard key={`${item.category}-${item.uid}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container py-5">
      <Section title="Personas" items={store.people} />
      <Section title="Vehículos" items={store.vehicles} />
      <Section title="Planetas" items={store.planets} />
    </div>
  );
};
