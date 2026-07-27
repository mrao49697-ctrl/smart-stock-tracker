import React from 'react';

const Layout: React.FC = ({ children }) => {
    return (
        <div>
            <header>
                <h1>Smart Stock Tracker</h1>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Smart Stock Tracker</p>
            </footer>
        </div>
    );
};

export default Layout;