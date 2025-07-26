import styles from './Sidebar.module.css'
import {NavLink} from "react-router-dom";

export default function Sidebar() {
    return(
        <aside className={styles.aside}>
            <nav>
                <ul className={styles.list}>
                    <li><NavLink to='/'>Главная</NavLink></li>
                    <li><NavLink to='/user/create'>Создать пользователя</NavLink></li>
                    {/*<li><NavLink to='/user/create/formik'>Создать пользователя (Formik)</NavLink></li>*/}
                </ul>
            </nav>
        </aside>
    )
}