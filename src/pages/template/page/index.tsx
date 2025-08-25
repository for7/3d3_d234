import { defineDataLoader, definePageConfig, useConfig, useData } from 'ice';
import { Row, Col } from 'antd';
import CardBarChart from '@/components/CardBarChart';
import CardAreaChart from '@/components/CardAreaChart';
import homeStore from './store';
import styles from './layout.module.less';

export default function Dashboard() {
  const [store, storeRef] = homeStore.useModel('config');
  const data = useData();
  const config = useConfig(); 
  console.log(222, data, config);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <CardBarChart />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <div className={styles.test}>62633</div>
        <p className='m-2.5 text-2xl text-yellow-500'>55525522</p>
        <span className='text-red-500 text-xl text-size-2xl'>5</span>
        <span>4444</span>
      </Col>

    </Row>
  );
}

export const dataLoader = defineDataLoader(async () => {
  return {
    aa: 122
  };
});

export const pageConfig = definePageConfig(() => {
  return {
    title: 'About',
    auth: ['admin', 'user'],
    meta: [
      {
        name: 'description',
        content: 'About Page'
      }
    ],
    menu: {
      isMenu: false,
      name: 'About',
      path: location.pathname,
    },
  };
});
