import { ConfigProvider } from 'antd';
import { gold } from '@ant-design/colors';
import { Home } from './components/screens/Home/Home';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Fredoka',
          colorPrimary: gold.primary,
          borderRadius: 8,
        },
      }}
    >
      <Home />
    </ConfigProvider>
  );
};

export default App;
