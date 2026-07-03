import { useState } from "react";
import DishesTable from "./components/DishTable";

function App() {

  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem("apiUrl") ||
    "http://3.20.57.154:3000/ops/menu/dishes"
  );

  const saveUrl = () => {
    localStorage.setItem("apiUrl", apiUrl);
    alert("URL guardada");
  };

  return (
    <div className="container">

      <h1>Menú Gourmet</h1>

      <div className="toolbar">

        <input
          value={apiUrl}
          onChange={(e) =>
            setApiUrl(e.target.value)
          }
        />

        <button onClick={saveUrl}>
          Guardar URL
        </button>

      </div>

      <DishesTable apiUrl={apiUrl}/>
    </div>
  );
}

export default App;