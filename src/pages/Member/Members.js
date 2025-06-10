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
    { name: 'Name', selector: row => row.name, sortable: true },  
    { name: 'Surname', selector: row => row.surname, sortable: true },
    { name: 'DOJ', selector: row => row.doj, sortable: true },
    { name: 'Aadhaar', selector: row => row.aadhaarno, sortable: true }, 
    { name: 'Savings', selector: row => row.total_saving, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
        <Link to ={`/membersedit/${row.m_no_encpt}`}
          className="btn btn-sm btn-primary"
          title="Edit"
        >
          <i className='fas fa-edit' />
        </Link>
        <Link to ={`/memberview/${row.m_no_encpt}`}
          className="btn btn-sm btn-primary mr-2 ml-2" style={{marginLeft:"5px"}}
          title="Edit"
        >
          <i className='fas fa-eye' />
        </Link>
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
