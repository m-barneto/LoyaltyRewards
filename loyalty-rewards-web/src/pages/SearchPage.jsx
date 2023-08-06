import React from 'react'
import { Link } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'


export default function SearchPage() {
  return (
    <MainLayout>
      <form className="d-flex" role="search">
        <input className="form-control me-2 form-control-lg" type="search" placeholder="Search" aria-label="Search" />
        <button className="btn btn-outline-success btn-lg" type="submit">Search</button>
      </form>
      <div className='mt-3 p-2 bg-dark rounded'>
        <table id="myTable" className="table table-dark table-striped table-hover table-bordered" style={{ fontSize: '1.2rem' }}>
          <thead>
            <tr>
              <th>ENO</th>
              <th>EMPName</th>
              <th>Country</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>001</td>
              <td>Anusha</td>
              <td>India</td>
              <td>10000</td>
            </tr>
            <tr>
              <td>002</td>
              <td>Charles</td>
              <td>United Kingdom</td>
              <td>28000</td>
            </tr>
            <tr>
              <td>003</td>
              <td>Sravani</td>
              <td>Australia</td>
              <td>7000</td>
            </tr>
            <tr>
              <td>004</td>
              <td>Amar</td>
              <td>India</td>
              <td>18000</td>
            </tr>
            <tr>
              <td>005</td>
              <td>Lakshmi</td>
              <td>India</td>
              <td>12000</td>
            </tr>
            <tr>
              <td>006</td>
              <td>James</td>
              <td>Canada</td>
              <td>50000</td>
            </tr>

            <tr>
              <td>007</td>
              <td>Ronald</td>
              <td>US</td>
              <td>75000</td>
            </tr>
            <tr>
              <td>008</td>
              <td>Mike</td>
              <td>Belgium</td>
              <td>100000</td>
            </tr>
            <tr>
              <td>009</td>
              <td>Andrew</td>
              <td>Argentina</td>
              <td>45000</td>
            </tr>

            <tr>
              <td>010</td>
              <td>Stephen</td>
              <td>Austria</td>
              <td>30000</td>
            </tr>
            <tr>
              <td>011</td>
              <td>Sara</td>
              <td>China</td>
              <td>750000</td>
            </tr>
            <tr>
              <td>012</td>
              <td>JonRoot</td>
              <td>Argentina</td>
              <td>65000</td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation example">
          <ul className="pagination pagination-lg pb-2 mb-0">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </MainLayout>
  )
}
