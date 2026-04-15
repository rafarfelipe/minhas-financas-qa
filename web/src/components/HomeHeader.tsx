import React from "react";

export const HomeHeader = React.memo(function HomeHeader() {
  return (
    <header className="mb-4">
      <h1 className="text-3xl font-bold text-white">Bem-vindo!</h1>
      <p className="text-white/60 mt-1">Aqui está um resumo das suas finanças:</p>
    </header>
  );
});
