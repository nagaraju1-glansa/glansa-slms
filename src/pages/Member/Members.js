import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import { FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';

const Member = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  useEffect(() => {
    //add loaddata function
    const loadData = async () => {
      try {
        const res = await CustomFetch(`/members`);
        const data = await res.json();
        setMembers(data);
        setFilteredMembers(data);
      } catch (err) {
        console.log(err, "Error found");
      }
    };
    loadData();
    
  }, []);


  useEffect(() => {
    const filtered = members.filter((item) => {
      const query = searchText.toLowerCase();
      return (
        item.name?.toLowerCase().includes(query) ||
        item.surname?.toLowerCase().includes(query) ||
        item.aadhaarno?.toLowerCase().includes(query)
      );
    });
    setFilteredMembers(filtered);
  }, [searchText, members]);


  const columns = [
    { name: 'M.no.', selector: row => row.m_no, sortable: true },
    { name: 'image', cell: row => <img
          src={row.image ? `${row.image}` : ""}
          alt="profile"
          className="rounded-circle img-fluid mb-3"
          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = "http://127.0.0.1:8000/storage/uploads/user.jpg";
          }}
        />, sortable: true },
    { name: 'Name', selector: row => row.name, sortable: true },  
    { name: 'Surname', selector: row => row.surname, sortable: true },
    { name: 'DOJ', selector: row => row.doj, sortable: true },
    { name: 'Aadhaar', selector: row => row.aadhaarno, sortable: true }, 
    { name: 'Savings', selector: row => row.total_saving, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
           {(storedPermissions.includes("member-view") ) && (
        <Link to ={`/membersedit/${row.m_no_encpt}`}
          className="btn btn-sm btn-primary"
          title="Edit"
        >
          <i className='fas fa-edit' />
        </Link>
        )}
        {(storedPermissions.includes("member-edit") ) && (
       <a
          href={`/memberview/${row.m_no_encpt}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-primary"
          title="View"
          style={{ marginLeft: "5px" }}
        >
          <i className='fas fa-eye' />
        </a>
        )}
        </div>
        
      ),
      ignoreRowClick: true,
    },

  ];

  return (
     <React.Fragment>
        <div className="page-content">
        <div>
          <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
              <h4 className="mb-0">Members List</h4>
              <button type="button" className="btn btn-success waves-effect waves-light"  onClick={()=> navigate('/membersadd') }>
                  <i className="fas fa-plus align-middle me-2"></i> Add 
              </button>
          </div>

          <div className='col-xl-2 mb-3'>
            <input
              type="text"
              placeholder="Search by name, surname or Aadhaar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='form-control'
            />
          </div>

          <DataTable
            columns={columns}
            data={Array.isArray(filteredMembers) ? filteredMembers : []}
            pagination
            highlightOnHover
            striped
            fixedHeader={true}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Member;
