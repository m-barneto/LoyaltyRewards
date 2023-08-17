import { React, useState, useEffect } from "react";

import axios from "axios";

import MainLayout from "../layouts/MainLayout";
import SearchBar from "../components/SearchBar";
import { useNavigate, useSearchParams } from "react-router-dom";

const Table = (props) => {
  const { data } = props;

  function getName(firstName, lastName) {
    if (lastName == null) {
      return firstName;
    }
    return firstName + " " + lastName;
  }

  let navigate = useNavigate();

  return (
    <table
      id="myTable"
      className="table table-dark table-striped table-hover table-bordered"
      style={{ fontSize: "1.2rem" }}
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((row) => (
            <tr
              key={row["id"]}
              onClick={() => navigate("../member/" + row["id"])}
              role="button"
            >
              <td>{getName(row["firstName"], row["lastName"])}</td>
              <td>{row["email"]}</td>
              <td>{row["points"]}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

const PageNav = (props) => {
  const { page, maxPage, changePage } = props;
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-lg pb-2 mb-0">
        <li className="page-item">
          <button
            className="page-link"
            aria-label="Previous"
            onClick={() => changePage(page - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {Array.from({ length: maxPage }).map((i, item) => {
          if (item === page) {
            return (
              <li key={item} className="page-item active">
                <button className="page-link">{item + 1}</button>
              </li>
            );
          }
          return (
            <li key={item} className="page-item">
              <button className="page-link" onClick={() => changePage(item)}>
                {item + 1}
              </button>
            </li>
          );
        })}
        <li className="page-item">
          <button
            className="page-link"
            aria-label="Next"
            onClick={() => changePage(page + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default function SearchPage() {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [refresh, setRefresh] = useState(true);

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (refresh) {
      popTable();
    }
    setRefresh(false);
  }, [refresh]);

  function changePage(val) {
    if (val >= 0 && val < maxPage) {
      setPage(val);
      setRefresh(true);
    }
  }

  function popTable() {
    if (searchParams.has("q") && searchParams.get("q") !== "") {
      axios
        .get("https://localhost:7223/LoyaltyMember/search", {
          params: { page: page, entries: 20, query: searchParams },
        })
        .then(function (response) {
          setMembers(response.data["item2"]);
          setMaxPage(response.data["item1"]);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .get("https://localhost:7223/LoyaltyMember/list", {
          params: { page: page, entries: 20 },
        })
        .then(function (response) {
          setMembers(response.data["item2"]);
          setMaxPage(response.data["item1"]);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setRefresh(true);
  }

  function search() {
    popTable();
  }

  return (
    <MainLayout>
      <SearchBar search={search}></SearchBar>
      <div className="mt-3 p-2 bg-dark rounded" onLoad={search}>
        <Table data={members} />
        <PageNav page={page} maxPage={maxPage} changePage={changePage} />
      </div>
    </MainLayout>
  );
}
