import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { debounce } from 'lodash';
import axios from 'axios';
import { useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Typography,
    Checkbox,
    DatePicker,
    Card,
    message, Select,
} from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface FormValues {
    name: string;
    surName: string;
    password: string;
    fullName: string;
    email: string;
    birthDate: string;
    telephone: string;
    employment: string;
    userAgreement: boolean;
}

const schema = yup.object({
    name: yup.string().required('Введите имя'),
    surName: yup.string().required('Введите фамилию'),
    fullName: yup.string().required('Введите полное имя'),
    email: yup.string().email('Некорректный email').required('Обязательное поле'),
    password: yup
        .string()
        .min(8, 'Минимум 8 символов')
        .matches(/[A-Z]/, 'Должна быть заглавная буква')
        .matches(/\d/, 'Должна быть цифра')
        .required('Введите пароль'),
    birthDate: yup.string().required('Введите дату рождения'),
    telephone: yup.string().required('Введите телефон'),
    employment: yup.string().required('Введите место работы'),
    userAgreement: yup.boolean().oneOf([true], 'Необходимо согласие с политикой').required(),
});

export default function CreateUserHook() {
    const navigate = useNavigate();

    const {
        control,
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            userAgreement: false,
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await axios.post('/api/v1/users', data, { withCredentials: true });
            message.success('Пользователь создан');
            navigate('/');
        } catch {
            message.error('Ошибка при создании пользователя');
        }
    };

    useEffect(() => {
        const subscription = watch(
            debounce((values) => {
                const fullName = `${values.name ?? ''} ${values.surName ?? ''}`.trim();

                if (values.fullName !== fullName) {
                    setValue('fullName', fullName, {
                        shouldValidate: false,
                        shouldDirty: false,
                    });
                }
            }, 300)
        );

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const getValidateStatus = (field: keyof FormValues) =>
        isSubmitted && errors[field] ? 'error' : '';

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Card title={<Title level={3}>Создание пользователя</Title>} style={{ width: 600 }}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Form.Item
                        label="Имя"
                        validateStatus={getValidateStatus('name')}
                        help={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Фамилия"
                        validateStatus={getValidateStatus('surName')}
                        help={errors.surName?.message}
                    >
                        <Controller
                            name="surName"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Полное имя"
                        validateStatus={getValidateStatus('fullName')}
                        help={errors.fullName?.message}
                    >
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => <Input {...field} readOnly />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        validateStatus={getValidateStatus('email')}
                        help={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => <Input {...field} type="email" />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        validateStatus={getValidateStatus('password')}
                        help={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => <Input.Password {...field} />}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Дата рождения"
                        validateStatus={getValidateStatus('birthDate')}
                        help={errors.birthDate?.message}
                    >
                        <Controller
                            name="birthDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD"
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(date) => field.onChange(date?.toISOString() || '')}
                                />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Телефон"
                        validateStatus={getValidateStatus('telephone')}
                        help={errors.telephone?.message}
                    >
                        <Controller
                            name="telephone"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="+79991112233"/>}
                        />
                    </Form.Item>


                    <Form.Item
                        label="Работа"
                        validateStatus={getValidateStatus('employment')}
                        help={errors.employment?.message}
                    >
                        <Controller
                            name="employment"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(value) => field.onChange(value)}
                                    placeholder="--Выберите--"
                                >
                                    <Option value="">--Выберите--</Option>
                                    <Option value="Работаю">Работаю</Option>
                                    <Option value="Учусь">Учусь</Option>
                                    <Option value="Безработный">Безработный</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>


                    <Form.Item
                        validateStatus={getValidateStatus('userAgreement')}
                        help={errors.userAgreement?.message}
                    >
                        <Controller
                            name="userAgreement"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                >
                                    Я согласен с политикой конфиденциальности
                                </Checkbox>
                            )}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                            Создать
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
