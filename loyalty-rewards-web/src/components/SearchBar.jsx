import React from 'react'

export default function SearchBar(props) {
  const { setQuery, search } = props;

  return (
    <form className="d-flex" role="search" onSubmit={search}>
      <input id='search' className="form-control me-2 form-control-lg" type="search" placeholder="Search" onChange={event => setQuery(event.target.value)} aria-label="Search" />
      <button className="btn btn-outline-success btn-lg" type="submit">Search</button>
    </form>
  )
}
