import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../../app/api';
import { useNavigate } from 'react-router-dom';

interface FormValues {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const initialValues: FormValues = {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Введите имя'),
    lastName: Yup.string().required('Введите фамилию'),
    fullName: Yup.string().required('Введите полное имя'),
    email: Yup.string().email('Некорректный email').required('Обязательное поле'),
    password: Yup.string()
        .required('Введите пароль')
        .min(8, 'Минимум 8 символов')
        .matches(/[A-Z]/, 'Должна быть заглавная буква')
        .matches(/\d/, 'Должна быть цифра'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Пароли не совпадают')
        .required('Повторите пароль'),
});

export default function FormikUserForm() {
    const navigate = useNavigate();

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            const { confirmPassword, ...payload } = values;
            await api.post('/v1/users', payload);
            navigate('/');
        } catch (error) {
            alert('Ошибка при создании пользователя');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <h2>Создание пользователя (Formik)</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, isSubmitting }) => {
                    useEffect(() => {
                        const autoFullName = `${values.firstName} ${values.lastName}`.trim();
                        if (!values.fullName || values.fullName === autoFullName) {
                            setFieldValue('fullName', autoFullName);
                        }
                    }, [values.firstName, values.lastName]);

                    return (
                        <Form>
                            <div>
                                <label>Имя</label>
                                <Field name="firstName" />
                                <div style={{ color: 'red' }}><ErrorMessage name="firstName" /></div>
                            </div>

                            <div>
                                <label>Фамилия</label>
                                <Field name="lastName" />
                                <div style={{ color: 'red' }}><ErrorMessage name="lastName" /></div>
                            </div>

                            <div>
                                <label>Полное имя</label>
                                <Field name="fullName" />
                                <div style={{ color: 'red' }}><ErrorMessage name="fullName" /></div>
                            </div>

                            <div>
                                <label>Email</label>
                                <Field name="email" type="email" />
                                <div style={{ color: 'red' }}><ErrorMessage name="email" /></div>
                            </div>

                            <div>
                                <label>Пароль</label>
                                <Field name="password" type="password" />
                                <div style={{ color: 'red' }}><ErrorMessage name="password" /></div>
                            </div>

                            <div>
                                <label>Подтверждение пароля</label>
                                <Field name="confirmPassword" type="password" />
                                <div style={{ color: 'red' }}><ErrorMessage name="confirmPassword" /></div>
                            </div>

                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Создание...' : 'Создать'}
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

