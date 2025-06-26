import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';

const Member = () => {
  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10); // default 20
  const navigate = useNavigate();
  const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

 const loadData = async (page = 1, perPageVal = perPage, search = searchText) => {
  try {
    const res = await CustomFetch(`/memberlist?page=${page}&per_page=${perPageVal}&search=${search}`);
    const data = await res.json();
    setMembers(data.data || []);
    setCurrentPage(data.current_page);
    setLastPage(data.last_page);
    setTotalRows(data.total);
  } catch (err) {
    console.error('Error loading members:', err);
  }
};

useEffect(() => {
  loadData(currentPage, perPage, searchText);
}, [currentPage, perPage, searchText]);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const handlePerRowsChange = (newPerPage, page) => {
  setPerPage(newPerPage);
  setCurrentPage(1); // reset to page 1
};


  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  // server-side pagination handler
  const filtered = members.filter((item) => {
    const query = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) ||
      item.surname?.toLowerCase().includes(query) ||
      item.aadhaarno?.toLowerCase().includes(query)
    );
  });

  const columns = [
    { name: 'M.no.', selector: row => row.member_id, sortable: true },
    {
      name: 'Image',
      cell: row => (
        <img
          src={row.image ? `${process.env.REACT_APP_APIURL_IMAGE}members/${row.image}` : ""}
          alt="profile"
          className="rounded-circle img-fluid mb-3"
          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = `${process.env.REACT_APP_APIURL_IMAGE}user.jpg`;
          }}
        />
      )
    },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Surname', selector: row => row.surname, sortable: true },
    { name: 'DOJ', selector: row => row.doj, sortable: true },
    { name: 'Aadhaar', selector: row => row.aadhaarno, sortable: true },
    { name: 'Savings', selector: row => row.total_saving, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
          {storedPermissions.includes("member-edit") && (
            <Link to={`/membersedit/${row.m_no_encpt}`} className="btn btn-sm btn-primary" title="Edit">
              <i className='fas fa-edit' />
            </Link>
          )}
          {storedPermissions.includes("member-view") && (
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
    }
  ];

  return (
    <div className="page-content">
      <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
        <h4 className="mb-0">Members List</h4>
        <button type="button" className="btn btn-success" onClick={() => navigate('/membersadd')}>
          <i className="fas fa-plus me-2"></i> Add
        </button>
      </div>

       <div className='col-xl-3 mb-3'>
      <input
        type="text"
        placeholder="Search by name, surname or Aadhaar..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setCurrentPage(1); // reset page on search
        }}
        className='form-control'
      />
    </div>

    <DataTable
      columns={columns}
      data={members}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      paginationPerPage={perPage}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerRowsChange}
      highlightOnHover
      striped
      fixedHeader
    />
    </div>
  );
};

export default Member;
