import { useEffect, useState } from "react";
import { getDishes } from "../services/api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DishesTable({ apiUrl }) {

  const [dishes, setDishes] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    loadData();
  }, [apiUrl]);

  const loadData = async () => {

    try {

      const data = await getDishes(apiUrl);

      setDishes(data);

    } catch {

      setDishes([]);

    }

  };

  const exportPdf = () => {

    const doc = new jsPDF();

    autoTable(doc, {

      head: [[
        "ID",
        "Nombre",
        "Precio",
        "Disponible"
      ]],

      body: dishes.map(d => [

        d.itemId,
        d.name,
        `$${d.price}`,
        d.isAvailable ? "Sí" : "No"

      ])

    });

    doc.save("menu.pdf");

  };

  const filtered =
    dishes.filter(x =>
      x.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalPages =
    Math.ceil(filtered.length / pageSize);

  const current =
    filtered.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  return (
    <>

      <div className="toolbar">

        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

        <button onClick={exportPdf}>
          Exportar PDF
        </button>

      </div>

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Disponible</th>
            <th>Fecha</th>

          </tr>

        </thead>

        <tbody>

          {current.map(item => (

            <tr key={item.itemId}>

              <td>{item.itemId}</td>

              <td>{item.name}</td>

              <td>{item.description}</td>

              <td>${item.price}</td>

              <td>{item.categoryId}</td>

              <td>

                <span
                  className={
                    item.isAvailable
                    ? "available"
                    : "unavailable"
                  }
                >
                  {
                    item.isAvailable
                    ? "Disponible"
                    : "No disponible"
                  }
                </span>

              </td>

              <td>
                {
                  new Date(
                    item.createdAt
                  ).toLocaleDateString()
                }
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="pagination">

        <button
          disabled={page===1}
          onClick={() =>
            setPage(page-1)
          }
        >
          Anterior
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={
            page===totalPages
          }
          onClick={() =>
            setPage(page+1)
          }
        >
          Siguiente
        </button>

      </div>

    </>
  );
}

export default DishesTable;