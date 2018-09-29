import React, { Component } from 'react';

// Import Header And Footer
import {Header} from './Header';
import {Footer} from './Footer';

// Import css
import '../../../css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

export default class AppTemplate extends Component {
    render() {
        const children = this.props.children;
        const isLogin = window.location.pathname === "/login";
        return (
            <div>
                {!isLogin ? <Header /> : null}
                {children}
                {!isLogin ? <Footer /> : null}
            </div>
        );
    }
}

// export default ({children}) => (
//     <div>
//         <Header />
//         {children}
//         <Footer />
//     </div>
// );