import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../app/api';
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Checkbox,
    Typography,
    message,
    Spin,
} from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface FormValues {
    name: string;
    surName: string;
    fullName: string;
    email: string;
    birthDate?: string;
    telephone?: string;
    employment?: string;
    userAgreement?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string().max(64).required('Введите имя'),
    surName: Yup.string().max(64).required('Введите фамилию'),
    fullName: Yup.string().max(130).required('Введите полное имя'),
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    birthDate: Yup.date().nullable(),
    telephone: Yup.string()
        .matches(/^\+?\d{11,15}$/, 'Некорректный телефон')
        .nullable(),
    employment: Yup.string().nullable(),
    userAgreement: Yup.boolean(),
});

export default function EditUserPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<FormValues | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                setLoading(true);
                const response = await api.get(`/v1/users/${id}`);
                setInitialValues({
                    name: response.data.name,
                    surName: response.data.surName,
                    fullName: response.data.fullName,
                    email: response.data.email,
                    birthDate: response.data.birthDate || undefined,
                    telephone: response.data.telephone || '',
                    employment: response.data.employment || '',
                    userAgreement: response.data.userAgreement || false,
                });
            } catch (error: any) {
                message.error(error.response?.data?.message || 'Ошибка загрузки');
                navigate('/');
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id]);

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            const payload: any = {
                name: values.name.trim(),
                surName: values.surName.trim(),
                fullName: values.fullName.trim(),
                telephone: values.telephone && values.telephone.trim() !== '' ? values.telephone.trim() : null,
                employment: values.employment && values.employment !== '' ? values.employment : null,
                userAgreement: values.userAgreement ?? false,
            };

            Object.keys(payload).forEach((key) => {
                if (payload[key] === null) delete payload[key];
            });

            await api.patch(`/v1/users/${id}`, payload);
            message.success('Пользователь обновлён');
            navigate('/');
        } catch (error) {
            console.error(error);
            message.error('Ошибка при сохранении');
        } finally {
            setSubmitting(false);
        }
    };



    if (loading || !initialValues) {
        return <Spin style={{ margin: 40 }} />;
    }

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Title level={3}>Редактирование пользователя</Title>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({
                      handleSubmit,
                      handleChange,
                      values,
                      setFieldValue,
                      isSubmitting,
                      errors,
                      touched,
                  }) => {
                    useEffect(() => {
                        const full = `${values.name} ${values.surName}`.trim();
                        if (values.fullName !== full) {
                            setFieldValue('fullName', full);
                        }
                    }, [values.name, values.surName]);

                    return (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                label="Имя"
                                validateStatus={touched.name && errors.name ? 'error' : ''}
                                help={touched.name && errors.name}
                            >
                                <Input name="name" value={values.name} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item
                                label="Фамилия"
                                validateStatus={touched.surName && errors.surName ? 'error' : ''}
                                help={touched.surName && errors.surName}
                            >
                                <Input name="surName" value={values.surName} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item
                                label="Полное имя"
                                validateStatus={touched.fullName && errors.fullName ? 'error' : ''}
                                help={touched.fullName && errors.fullName}
                            >
                                <Input name="fullName" value={values.fullName} disabled />
                            </Form.Item>

                            <Form.Item label="Email">
                                <Input name="email" value={values.email} disabled />
                            </Form.Item>

                            <Form.Item
                                label="Дата рождения"
                                validateStatus={touched.birthDate && errors.birthDate ? 'error' : ''}
                                help={touched.birthDate && errors.birthDate}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    value={values.birthDate ? dayjs(values.birthDate) : undefined}
                                    onChange={(_, dateString) => {
                                        setFieldValue('birthDate', dateString || '');
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Телефон"
                                validateStatus={touched.telephone && errors.telephone ? 'error' : ''}
                                help={touched.telephone && errors.telephone}
                            >
                                <Input
                                    name="telephone"
                                    value={values.telephone}
                                    onChange={handleChange}
                                    placeholder="+79991112233"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Работа"
                                validateStatus={touched.employment && errors.employment ? 'error' : ''}
                                help={touched.employment && errors.employment}
                            >
                                <Select
                                    value={values.employment || ''}
                                    onChange={(value) => setFieldValue('employment', value)}
                                >
                                    <Option value="">--Выберите--</Option>
                                    <Option value="Работаю">Работаю</Option>
                                    <Option value="Учусь">Учусь</Option>
                                    <Option value="Безработный">Безработный</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                validateStatus={touched.userAgreement && errors.userAgreement ? 'error' : ''}
                                help={touched.userAgreement && errors.userAgreement}
                            >
                                <Checkbox
                                    checked={values.userAgreement}
                                    onChange={(e) => setFieldValue('userAgreement', e.target.checked)}
                                >
                                    Пользовательское соглашение
                                </Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                    Сохранить
                                </Button>
                            </Form.Item>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
