import { useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../services/productoService";
import "./ProductoList.css";

interface Props {
  onEditar: (producto: Producto) => void;
  recarga: number;
}

export const ProductoList = ({ onEditar, recarga }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosObtenidos = await obtenerProductos();
        setProductos(productosObtenidos);
      } catch (error) {
        console.error("Error al obtener los productos: ", error);
        setError(true);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, [recarga]);

  return (
    <section className="producto-list" aria-labelledby="producto-list-title">
      <header className="producto-list__header">
        <div>
          <p className="producto-list__eyebrow">Inventario</p>
          <h2 className="producto-list__title" id="producto-list-title">
            Lista de productos
          </h2>
        </div>
        {!cargando && !error && (
          <span className="producto-list__count">
            {productos.length} {productos.length === 1 ? "producto" : "productos"}
          </span>
        )}
      </header>

      {cargando ? (
        <p className="producto-list__message" role="status">
          Cargando productos…
        </p>
      ) : error ? (
        <p className="producto-list__message producto-list__message--error" role="alert">
          No se pudieron cargar los productos. Inténtalo de nuevo más tarde.
        </p>
      ) : productos.length === 0 ? (
        <p className="producto-list__message">
          Aún no hay productos. Cuando agregues uno, aparecerá aquí.
        </p>
      ) : (
        <ul className="producto-list__grid">
          {productos.map((producto) => (
            <li className="producto-card" key={producto.id}>
              <div className="producto-card__header">
                <h3 className="producto-card__name">{producto.nombre}</h3>
                <span className="producto-card__stock">
                  {producto.stock} en stock
                </span>
              </div>
              <dl className="producto-card__details">
                <div className="producto-card__detail">
                  <dt>Precio</dt>
                  <dd>${producto.precio.toFixed(2)} USD</dd>
                </div>
                <div className="producto-card__detail producto-card__detail--id">
                  <dt>ID</dt>
                  <dd>{producto.id}</dd>
                </div>
              </dl>
              <button type="button" className="producto-card__editar" onClick={() => onEditar(producto)}>
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProductoList;
