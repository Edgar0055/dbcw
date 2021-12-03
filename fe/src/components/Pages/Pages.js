import { Link, } from 'react-router-dom';

const Pages = ({ page, setPage, limit, setLimit, count, }) => {
    if (!count || !limit) return null;
    const items = Array.from(Array(Math.ceil(count/limit)), (_, i) => i);
    const onClick = (p) => (event) => {
        event.preventDefault();
        setPage(p);
    }
    return (<ul className="pages">
        {items.map((i, key) => (<li key={key}>
            <Link
                to="#"
                onClick={page === i ? null : onClick(i)}
                data-current={page === i}
            >
                {i + 1}
            </Link>
        </li>))}
    </ul>);
};

export default Pages;
