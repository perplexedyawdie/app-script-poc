import type { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next'
import { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable, { TableColumn, TableRow } from 'react-data-table-component';
import classNames from 'classnames';
interface CustomerDetails {
  id: string;
  name: string;
  email: string;
}

enum ModalActions {
  'EDIT' = 'Edit Customer Details',
  'ADD' = 'Add a new Customer'
}

const Home: NextPage = () => {
  const [selectedRow, setSelectedRow] = useState(null)
  const [displayModal, setDisplayModal] = useState(false)
  const [modalAction, setModalAction] = useState(ModalActions.EDIT)
  const [toggleSelectedRow, setToggleSelectedRow] = useState(false)
  const editModalClass = classNames('modal', {
    'is-active': displayModal
  })
  useEffect(() => {

  }, [])
  const columns: TableColumn<CustomerDetails>[] = [
    {
      name: 'ID',
      selector: row => row.id,
    },
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Email',
      selector: row => row.email,
    }
  ];
  const data = [
    {
      id: '1a',
      name: 'June Bean',
      email: 'jbee@email.com',
    },
    {
      id: '2s',
      name: 'Juan Mata',
      email: 'best@email.com',
    },
  ]

  const contextActions = useMemo(() => {

    function handleEditCustomerBtnClick() {
      setToggleSelectedRow(prevState => !prevState);
      setModalAction(ModalActions.EDIT);
      setDisplayModal(true);
    }

    return (
      <>
        <button onClick={() => handleEditCustomerBtnClick()} className='button is-primary is-small'>Edit Customer Details</button>
      </>
    )
  }, [selectedRow])

  const headerActions = useMemo(() => {

    function handleAddCustomerClick() {
      // setToggleSelectedRow(prevState => !prevState);
      setModalAction(ModalActions.ADD);
      setDisplayModal(true);
    }
    return (
      <button onClick={() => handleAddCustomerClick()} className='button is-secondary is-small'>Add a Customer</button>
    )
  }, [])

  const handleRowSelected = useCallback(state => {
    setSelectedRow(state.selectedRows);
  }, []);

  return (
    <section className="hero background-gradient is-fullheight">
      <div className="hero-body">
        <div className="container is-flex is-justify-content-center is-align-items-center is-flex-direction-column">
          <DataTable
            title='Customer Details'
            columns={columns}
            data={data}
            responsive={true}
            keyField='id'
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            selectableRowsSingle
            actions={headerActions}
            clearSelectedRows={toggleSelectedRow}
          />
        </div>
      </div>

      <div className={editModalClass}>
        <div className="modal-background" onClick={() => setDisplayModal(prevState => !prevState)} ></div>
        <div className="modal-content">
          <div className="box">
            <div className="field mb-6">
              <h1 className='title has-text-centered'>{modalAction}</h1>
            </div>

            {
              modalAction === ModalActions.EDIT ?
                <div className="field">
                  <label className="label">ID</label>
                  <div className="control">
                    <input className="input" type="text" placeholder="e.g Alex Smith" />
                  </div>
                </div>
                : null
            }
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="e.g Alex Smith" />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input className="input" type="email" placeholder="e.g. alexsmith@gmail.com" />
              </div>
            </div>
          </div>

        </div>
        <button onClick={() => setDisplayModal(prevState => !prevState)} className="modal-close is-large" aria-label="close"></button>
      </div>
    </section>
  )
}
// export const getServerSideProps: GetServerSideProps = async (context): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> => {
//   return {
//     notFound: true
//   }
// }

export default Home
