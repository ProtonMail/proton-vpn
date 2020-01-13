import React from 'react';
import PropTypes from 'prop-types';
import {
    UsernameSection,
    PasswordsSection,
    TwoFactorSection,
    NewsSection,
    DeleteSection,
    EmailSection,
    OpenVPNAccountSection
} from 'react-components';
import { c } from 'ttag';

import Page from '../components/page/Page';

export const getAccountPage = () => {
    return {
        text: c('Title').t`Account`,
        route: '/account',
        icon: 'account',
        sections: [
            {
                text: c('Title').t`Username`,
                id: 'username'
            },
            {
                text: c('Title').t`Passwords`,
                id: 'passwords'
            },
            {
                text: c('Title').t`Two-factor authentication`,
                id: 'two-fa'
            },
            {
                text: c('Title').t`OpenVPN / IKEv2 username`,
                id: 'openvpn'
            },
            {
                text: c('Title').t`Recovery & notification`,
                id: 'email'
            },
            {
                text: c('Title').t`Email subscriptions`,
                id: 'news'
            },
            {
                text: c('Title').t`Delete`,
                id: 'delete'
            }
        ]
    };
};

const AccountContainer = ({ setActiveSection }) => {
    return (
        <Page config={getAccountPage()} setActiveSection={setActiveSection}>
            <UsernameSection />
            <PasswordsSection />
            <TwoFactorSection />
            <OpenVPNAccountSection />
            <EmailSection />
            <NewsSection />
            <DeleteSection />
        </Page>
    );
};

AccountContainer.propTypes = {
    setActiveSection: PropTypes.func
};

export default AccountContainer;
