import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customers')
          .select('names, surnames, email, cellphone, age, birth_date');
        if (error) throw error;
        setCustomers(data);
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="page">
      <section className="card--wide">

        <div className="header-container">
          <h1 className="main-title">Registered Customers</h1>
          <p className="subtitle-elegant">ESPE Student Management System</p>
        </div>
        <div className="table-responsive">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Names</th>
                <th>Surnames</th>
                <th>Email</th>
                <th>Cellphone</th>
                <th>Age</th>
                <th>Birth Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
              ) : (
                customers.map((c, i) => (
                  <tr key={i}>
                    <td>{c.names}</td>
                    <td>{c.surnames}</td>
                    <td>{c.email}</td>
                    <td>{c.cellphone}</td>
                    <td>{c.age}</td>
                    <td>{c.birth_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;