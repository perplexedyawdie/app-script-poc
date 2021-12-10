import type { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next'
import DataTable, { TableColumn, TableRow } from 'react-data-table-component';

interface CustomerDetails {
  id: string;
  name: string;
  email: string;
}

const Home: NextPage = () => {
  const columns: TableColumn<CustomerDetails | any>[] = [
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
  },
  {
    name: '',
    selector: row => <button className='button is-primary'>Edit</button>
  }
];
const data = [
  {
      id: '1',
      name: 'June Bean',
      email: 'jbee@email.com',
  },
  {
    id: '2',
    name: 'Juan Mata',
    email: 'best@email.com',
},
]
  return (
    <section className="hero background-gradient is-fullheight">
      <div className="hero-body">
        <div className="container is-flex is-justify-content-center is-align-items-center">
        <DataTable
            columns={columns}
            data={data}
            responsive={true}
            keyField='id'
        />
        </div>
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
