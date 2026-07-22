export const initialStore = () => {
  return {

    people: [],
    vehicles: [],
    planets: [],

    details: {},

    favorites: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_people":
      return { ...store, people: action.payload };

    case "set_vehicles":
      return { ...store, vehicles: action.payload };

    case "set_planets":
      return { ...store, planets: action.payload };

    case "set_detail": {

      const { key, data } = action.payload;
      return { ...store, details: { ...store.details, [key]: data } };
    }

    case "add_favorite": {
      // payload: { uid, name, category }
      const { uid, category } = action.payload;
      const exists = store.favorites.some(
        (f) => f.uid === uid && f.category === category
      );
      if (exists) return store;
      return { ...store, favorites: [...store.favorites, action.payload] };
    }

    case "remove_favorite": {

      const { uid, category } = action.payload;
      return {
        ...store,
        favorites: store.favorites.filter(
          (f) => !(f.uid === uid && f.category === category)
        ),
      };
    }

    default:
      throw Error("Unknown action.");
  }
}