import { React, useState, useEffect } from 'react'
import axios from 'axios';
import MainLayout from '../layouts/MainLayout'

const Row = (props) => {
  const { name, email, points } = props;

  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{points}</td>
    </tr>
  )
}

const Table = (props) => {
  const { data } = props;

  function getName(firstName, lastName) {
    if (lastName == null) {
      return firstName;
    }
    return firstName + ' ' + lastName;
  }

  return (
    <table id="myTable" className="table table-dark table-striped table-hover table-bordered" style={{ fontSize: '1.2rem' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row =>
          <Row key={row['id']} name={getName(row['firstName'], row['lastName'])} email={row['email']} points={row['points']} />
        )}
      </tbody>
    </table>
  )
}

const PageNav = (props) => {
  const { page, maxPage, changePage } = props;
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-lg pb-2 mb-0">
        <li className="page-item">
          <button className="page-link" aria-label="Previous" onClick={() => changePage(page - 1)}>
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {Array.from({ length: maxPage }).map((i, item) => {
          if (item === page) {
            return <li key={item} className="page-item active"><button className="page-link">{item + 1}</button></li>;
          }
          return <li key={item} className="page-item"><button className="page-link" onClick={() => changePage(item)}>{item + 1}</button></li>;
        })}
        <li className="page-item">
          <button className="page-link" aria-label="Next" onClick={() => changePage(page + 1)}>
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default function SearchPage(props) {

  const [query, setQuery] = useState(null);
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    popTable();
  }, [page])

  function changePage(val) {
    if (val >= 0 && val < maxPage) {
      setPage(val);
    }
  }

  function popTable() {
    if (query) {
      axios.get('https://localhost:7223/LoyaltyMember/search', { params: { page: page, entries: 20, query: query } })
        .then(function (response) {
          setMembers(response.data['item2']);
          setMaxPage(response.data['item1']);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios.get('https://localhost:7223/LoyaltyMember/list', { params: { page: page, entries: 20 } })
        .then(function (response) {
          setMembers(response.data['item2']);
          setMaxPage(response.data['item1']);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  function search(e) {
    e.preventDefault();

    if (page === 0) {
      popTable();
    }
    setPage(0);

  }

  return (
    <MainLayout>
      <form className="d-flex" role="search" onSubmit={search}>
        <input id='search' className="form-control me-2 form-control-lg" type="search" placeholder="Search" onChange={event => setQuery(event.target.value)} aria-label="Search" />
        <button className="btn btn-outline-success btn-lg" type="submit">Search</button>
      </form>
      <div className='mt-3 p-2 bg-dark rounded' onLoad={search}>
        <Table data={members} />
        <PageNav page={page} maxPage={maxPage} changePage={changePage} />
      </div>
    </MainLayout>
  )
}
