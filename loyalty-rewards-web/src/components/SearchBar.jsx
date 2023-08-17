import {React, useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState("");
  let navigate = useNavigate();
//<SearchBar search={search} setQuery={(x) => setSearchParams({'q': encodeURIComponent(x)})}></SearchBar>
  return (
    <form className="d-flex" role="search" onSubmit={(e) => {
      e.preventDefault();
      navigate('/search?q=' + query, {'relative': false});
    }}>
      <input id='search' className="form-control me-2 form-control-lg" type="search" placeholder="Search" onChange={(x) => setQuery(encodeURIComponent(x.target.value))} aria-label="Search" />
      <button className="btn btn-outline-success btn-lg" type="submit">Search</button>
    </form>
  )
}
