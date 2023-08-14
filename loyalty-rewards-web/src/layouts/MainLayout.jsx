import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import NewMember from '../components/NewMember';

export default function MainLayout({ children }) {
  return (
    <div>
      <header>
        <nav className="navbar navbar-light bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to='/'>Loyalty Rewards</Link>
          </div>
        </nav>
      </header>
      <main className='container mt-3'>
        <div className='bg-secondary-subtle p-2 mt-4 rounded-3'>
          <Button variant="secondary">
            Config
          </Button>
          <NewMember />
        </div>
        <div className='bg-secondary-subtle p-5 mt-4 rounded-3'>
          {children}
        </div>
      </main>
    </div>
  )
}
