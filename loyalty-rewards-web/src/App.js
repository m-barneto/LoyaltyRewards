import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/search' element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
