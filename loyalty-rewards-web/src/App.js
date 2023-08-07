import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import MemberPage from "./pages/MemberPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/member/:id' element={<MemberPage />} />
      </Routes>
    </Router>
  );
}

export default App;
