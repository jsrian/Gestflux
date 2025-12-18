import { Link } from "react-router-dom";

export default function Principal() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#12726E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: 24,
          lineHeight: "22px",
        }}
      >
        <h1 style={{ color: "white" }}>Gestflux</h1>
      </div>

      {/* Shape central */}
      <div
        style={{
          marginTop: 120,
          width: 130,
          height: 100,
          borderRadius: 50,
        }}
      >
        {/* Caminhos de imagem */}
        <img src="/logov2.png" alt="Logo" className="rounded-lg" />
      </div>

      {/* Botões */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Usando o componente Link */}
        <Link
          to="/perguntas"
          style={{
            backgroundColor: "white",
            color: "#1b756f",
            border: "none",
            padding: "10px 30px",
            borderRadius: 25,
            fontWeight: "bold",
            cursor: "pointer",
            display: "inline-block",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          EMERGÊNCIA
        </Link>

        <button
          style={{
            backgroundColor: "white",
            color: "#1b756f",
            border: "none",
            padding: "10px 30px",
            borderRadius: 25,
            fontWeight: "bold",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          CONSULTAS E <br /> EXAMES
        </button>
      </div>
    </div>
  );
}