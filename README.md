# Работа с формами и аутентификацией

Проект представляет собой форму редактирования пользователя с валидацией, реализованную на React с использованием TypeScript и Ant Design.

## Особенности

- Полностью типизированный код с использованием TypeScript
- Валидация формы с помощью Yup и react-hook-form
- Интеграция с Ant Design компонентами
- Автоматическое обновление полного имени при изменении имени/фамилии
- Обработка загрузки данных и ошибок
- Датапикер для выбора даты рождения

## Технологии

- React 18+
- TypeScript
- Ant Design 5+
- react-hook-form
- Yup (для валидации)
- dayjs (для работы с датами)
- lodash.debounce (для оптимизации)

## Установка

1. Клонируйте репозиторий и запустите:
```bash
git clone https://github.com/SergeiKostiaev/form-auth-t1.git
npm install
npm run dev
```
2. Для работы сервера 
```bash
git clone https://github.com/Pardeg/forms-server.git
npm install
npm run start