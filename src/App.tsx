import './App.css'
import AppRouter from './routes/AppRouter'
import 'antd/dist/reset.css';
import {ConfigProvider} from "antd";
import ruRU from 'antd/locale/ru_RU';

function App() {
  return (
      <ConfigProvider locale={ruRU}>
        <AppRouter />
      </ConfigProvider>
  )
}

export default App
