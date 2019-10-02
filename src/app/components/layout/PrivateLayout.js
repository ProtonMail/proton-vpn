import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Route } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Sidebar, MainAreaContext } from 'react-components';

import PrivateHeader from './PrivateHeader';

const PrivateLayout = ({ children, location }) => {
    const mainAreaRef = useRef();
    const [expanded, setExpand] = useState(false);
    const list = [
        {
            icon: 'dashboard',
            text: c('Link').t`Dashboard`,
            link: '/dashboard'
        },
        {
            icon: 'account',
            text: c('Link').t`Account`,
            link: '/account'
        },
        {
            icon: 'download',
            text: c('Link').t`Downloads`,
            link: '/downloads'
        },
        {
            icon: 'payments',
            text: c('Link').t`Payments`,
            link: '/payments'
        }
    ];

    useEffect(() => {
        setExpand(false);

        mainAreaRef.current.scrollTop = 0;
    }, [location.pathname]);

    return (
        <div className="flex flex-nowrap no-scroll">
            <div className="content flex-item-fluid reset4print">
                <PrivateHeader expanded={expanded} onToggleExpand={() => setExpand(!expanded)} />
                <div className="flex flex-nowrap">
                    <Route path="/:path" render={() => <Sidebar url="/account" expanded={expanded} list={list} />} />
                    <div className="main flex-item-fluid main-area scroll-smooth-touch" ref={mainAreaRef}>
                        <div className="flex flex-reverse">
                            <MainAreaContext.Provider value={mainAreaRef}>{children}</MainAreaContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

PrivateLayout.propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired
};

export default withRouter(PrivateLayout);
