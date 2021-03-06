import type { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next'
import { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import classNames from 'classnames';
import axios from 'axios';
import HttpStatusCode from '../models/http-status-codes.enum';
import { CustomerDetails, NewCustomer } from '../models/customer.model';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

enum ModalActions {
  'EDIT' = 'Edit Customer Details',
  'ADD' = 'Add a new Customer'
}

interface Props {
  customerData: CustomerDetails[];
}

const Home: NextPage<Props> = ({ customerData }) => {
  const [selectedRow, setSelectedRow] = useState<CustomerDetails>()
  const [displayModal, setDisplayModal] = useState(false)
  const [modalAction, setModalAction] = useState(ModalActions.EDIT)
  const [toggleSelectedRow, setToggleSelectedRow] = useState(false)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails[]>(customerData)
  const [newCustomer, setNewCustomer] = useState<NewCustomer>()
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const editModalClass = classNames('modal', {
    'is-active': displayModal
  })
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  useEffect(() => {
    if (newCustomer !== null && modalAction === ModalActions.ADD) {
      axios.post<NewCustomer>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/add-new-customer`, newCustomer)
        .then((data) => {
          return axios.get<CustomerDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/load-customers`)
        })
        .then((data) => setCustomerDetails(data.data))
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: 'Ohh no. Something happened on our end :( try again in a few will ya?'
          })
          console.error(err);
        })
    }
  }, [newCustomer])

  useEffect(() => {
    Toast.fire({
      icon: 'success',
      title: 'Customer data loaded successfully!'
    })
  }, [customerDetails])
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
  }, [])

  const headerActions = useMemo(() => {

    function handleAddCustomerClick() {
      setModalAction(ModalActions.ADD);
      setDisplayModal(true);
    }
    return (
      <button onClick={() => handleAddCustomerClick()} className='button is-info is-small'>Add a Customer</button>
    )
  }, [])

  const handleRowSelected = useCallback(state => {
    setSelectedRow(state.selectedRows[0]);
  }, []);

  function handleNameInputChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRow((prevState) => {
      const updatedDetails: CustomerDetails = {
        id: prevState?.id || '',
        email: prevState?.email || '',
        name: target.value || ''
      }
      return updatedDetails
    })
  }

  function handleEmailInputChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRow((prevState) => {
      const updatedDetails: CustomerDetails = {
        id: prevState?.id || '',
        email: target.value || '',
        name: prevState?.name || ''
      }
      return updatedDetails
    })
  }

  function handleNewNameInputChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setNewCustomerName(target.value)
  }

  function handleNewEmailInputChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setNewCustomerEmail(target.value)
  }

  async function saveCustomerDetailChanges() {

    // const { data, status } = await axios.get<CustomerDetailsDto>('https://app-script-poc.vercel.app/api/load-customers');
    switch (modalAction) {
      case ModalActions.ADD:
        setNewCustomer({
          name: `${newCustomerName}`,
          email: `${newCustomerEmail}`
        })
        break;
      case ModalActions.EDIT:
        const { data, status } = await axios.post<CustomerDetails>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-customer-details`, selectedRow);
        if (status == HttpStatusCode.OK) {
          Toast.fire({
            icon: 'success',
            title: 'Customer updated successfully!'
          })
          const { data, status } = await axios.get<CustomerDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/load-customers`);
          setCustomerDetails(data);
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Ohh no. Something happened on our end :( try again in a few will ya?'
          })
        }
        break;

      default:
        break;
    }
    setDisplayModal(false);
  }

  return (
    <section className="hero background-gradient is-fullheight">
      <div className="hero-body">
        <motion.div
          className="container is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.5
          }}
        >
          <DataTable
            title='Customer Details'
            columns={columns}
            data={customerDetails}
            responsive={true}
            keyField='id'
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            selectableRowsSingle
            actions={headerActions}
            clearSelectedRows={toggleSelectedRow}
          />
        </motion.div>
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
                    <input className="input" type="text" value={selectedRow?.id || ""} disabled />
                  </div>
                </div>
                : null
            }
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                {
                  modalAction === ModalActions.EDIT ?
                    <input className="input" type="text" value={selectedRow?.name || ""} onChange={(e) => handleNameInputChange(e)} />
                    :
                    <input className="input" type="text" placeholder="e.g Alex Smith" value={newCustomerName} onChange={(e) => handleNewNameInputChange(e)} />
                }
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                {
                  modalAction === ModalActions.EDIT ?
                    <input className="input" type="email" value={selectedRow?.email || ""} onChange={handleEmailInputChange} />
                    :
                    <input className="input" type="email" placeholder="e.g. alexsmith@gmail.com" value={newCustomerEmail} onChange={(e) => handleNewEmailInputChange(e)} />
                }
              </div>
            </div>

            <div className="field">
              <div className="control is-flex is-justify-content-center">
                <button onClick={() => saveCustomerDetailChanges()} className="button is-success">Save</button>
              </div>
            </div>
          </div>


        </div>
        <button onClick={() => setDisplayModal(prevState => !prevState)} className="modal-close is-large" aria-label="close"></button>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> => {
  const { data, status } = await axios.get<CustomerDetails[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/load-customers`);
  if (status === HttpStatusCode.OK) {
    return {
      props: {
        customerData: data
      },
    }
  }
  return {
    notFound: true
  }
}

export default Home
