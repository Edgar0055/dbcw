import { Link, } from 'react-router-dom';

const Menu = () => (<ul className="menu">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/sensors">Sensors</Link></li>
    <li><Link to="/statistic">Statistic</Link></li>
    <li><Link to="/404">Unknown</Link></li>
</ul>);

export default Menu;
