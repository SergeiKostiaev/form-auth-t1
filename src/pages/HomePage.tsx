import { Table, Typography, Layout, message, Modal, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";

const { Title } = Typography;
const { confirm } = Modal;

interface User {
    id: string;
    name: string;
    surName: string;
    email: string;
    birthDate?: string;
    telephone?: string;
    employment?: string;
}

export default function HomePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        axios
            .get('/api/v1/users')
            .then((res) => setUsers(res.data))
            .catch(() => message.error('Ошибка загрузки пользователей'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id: string) => {
        confirm({
            title: 'Вы уверены, что хотите удалить пользователя?',
            okText: 'Удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await axios.delete(`/api/v1/users/${id}`);
                    message.success('Пользователь удалён');
                    fetchUsers();
                } catch {
                    message.error('Ошибка при удалении');
                }
            },
        });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Имя',
            dataIndex: 'name',
        },
        {
            title: 'Фамилия',
            dataIndex: 'surName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Дата рождения',
            dataIndex: 'birthDate',
            render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
        },
        {
            title: 'Телефон',
            dataIndex: 'telephone',
            render: (phone: string) => phone || '-',
        },
        {
            title: 'Работа',
            dataIndex: 'employment',
            render: (emp: string) => emp || '-',
        },
        {
            title: 'Действия',
            render: (_, user) => (
                <Space>
                    <Link to={`/user/edit/${user.id}`}>Редактировать</Link>
                    <Button type="link" danger onClick={() => handleDelete(user.id)}>
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout.Content style={{ padding: 24 }}>
            <Title level={2}>Список пользователей</Title>
            <Table
                rowKey="id"
                dataSource={users}
                columns={columns}
                loading={loading}
                bordered
                pagination={{ pageSize: 10 }}
            />
        </Layout.Content>
    );
}
