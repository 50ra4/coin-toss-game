import { BrowserRouter, Routes, Route } from 'react-router-dom';

const basename = import.meta.env.BASE_URL;

function Placeholder({ name }: { name: string }) {
  return <div>{name}</div>;
}

export function AppRouter() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/game/:mode" element={<Placeholder name="Game" />} />
        <Route path="/result" element={<Placeholder name="Result" />} />
      </Routes>
    </BrowserRouter>
  );
}
