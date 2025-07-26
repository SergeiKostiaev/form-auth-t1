import { Form, Input, Button, Typography, Card, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            await axios.post('/api/v1/auth/login', values, { withCredentials: true });

            await axios.get('/api/v1/auth/me', { withCredentials: true });

            message.success('Успешный вход!');
            navigate('/');
        } catch (error) {
            message.error('Неверный email или пароль');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card title={<Title level={3}>Вход</Title>} style={{ width: 400 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Введите email' },
                            { type: 'email', message: 'Некорректный email' },
                        ]}
                    >
                        <Input placeholder="Введите email" />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password placeholder="Введите пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
