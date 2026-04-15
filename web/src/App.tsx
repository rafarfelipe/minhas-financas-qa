import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { PessoasList } from "@/pages/PessoasList";
import { CategoriasList } from "@/pages/CategoriasList";
import { TransacoesList } from "@/pages/TransacoesList";
import { Totais } from "@/pages/Totais";
import { Home } from "@/pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="pessoas" element={<PessoasList />} />
        <Route path="categorias" element={<CategoriasList />} />
        <Route path="transacoes" element={<TransacoesList />} />
        <Route path="totais" element={<Totais />} />
      </Route>
    </Routes>
  );
}

export default App;
