import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Tooltip,
    Icon,
    CurrencySelector,
    CycleSelector,
    SmallButton,
    Info,
    useApiResult,
    Loader
} from 'react-components';
import { c } from 'ttag';
import { PLANS, DEFAULT_CURRENCY, DEFAULT_CYCLE, PLAN_TYPES, PLAN_SERVICES, CYCLE } from 'proton-shared/lib/constants';

import PlanPrice from './PlanPrice';
import { queryVPNLogicalServerInfo } from 'proton-shared/lib/api/vpn';

const { VISIONARY, VPNBASIC, VPNPLUS } = PLANS;
const { PLAN } = PLAN_TYPES;
const { VPN } = PLAN_SERVICES;

const PLAN_NUMBERS = {
    free: 1,
    [VPNBASIC]: 2,
    [VPNPLUS]: 3,
    [VISIONARY]: 4
};

const PlansTable = ({
    plans = [],
    loading,
    onSelect,
    cycle = DEFAULT_CYCLE,
    updateCycle,
    currency = DEFAULT_CURRENCY,
    updateCurrency,
    subscription,
    extendedDetails = false
}) => {
    const mySubscriptionText = c('Title').t`My subscription`;
    const { Plans = [] } = subscription || {};
    const { Name = 'free' } = Plans.find(({ Services, Type }) => Type === PLAN && Services & VPN) || {};

    const { loading: serversLoading, result, request } = useApiResult(queryVPNLogicalServerInfo);

    useEffect(() => {
        request();
    }, []);

    const countCountries = (servers) =>
        Object.keys(servers.reduce((countries, { ExitCountry }) => ({ ...countries, [ExitCountry]: true }), {}));

    const freeCountriesCount = result && countCountries(result.LogicalServers.filter(({ Tier }) => Tier === 0)).length;
    const basicCountriesCount = result && countCountries(result.LogicalServers.filter(({ Tier }) => Tier <= 1)).length;
    const allCountriesCount = result && countCountries(result.LogicalServers).length;

    const addCycleTooltip = (comp) => {
        if (cycle === CYCLE.MONTHLY) {
            return <Tooltip title={c('Tooltip').t`Save 20% when billed annually`}>{comp}</Tooltip>;
        }

        return comp;
    };

    return (
        <table className="pm-plans-table pm-table--highlight noborder" data-plan-number={PLAN_NUMBERS[Name]}>
            <thead>
                <tr>
                    <th className="is-empty" />
                    <th className="aligncenter" data-highlight={mySubscriptionText}>
                        FREE
                    </th>
                    <th className="aligncenter" data-highlight={mySubscriptionText}>
                        BASIC
                    </th>
                    <th className="aligncenter" data-highlight={mySubscriptionText}>
                        PLUS
                    </th>
                    <th className="aligncenter" data-highlight={mySubscriptionText}>
                        VISIONARY
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        {addCycleTooltip(
                            <div className="flex flex-column">
                                <div className="mb0-5">
                                    <CurrencySelector currency={currency} onSelect={updateCurrency} />
                                </div>
                                <div>
                                    <CycleSelector cycle={cycle} onSelect={updateCycle} />
                                </div>
                            </div>
                        )}
                    </th>
                    <td className="aligncenter bg-global-light">FREE</td>
                    <td className="aligncenter bg-global-light">
                        <PlanPrice cycle={cycle} currency={currency} plans={plans} planName={VPNBASIC} />
                    </td>
                    <td className="aligncenter bg-global-light">
                        <PlanPrice cycle={cycle} currency={currency} plans={plans} planName={VPNPLUS} />
                    </td>
                    <td className="aligncenter bg-global-light">
                        <PlanPrice cycle={cycle} currency={currency} plans={plans} planName={VISIONARY} />
                    </td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        <span className="mr0-5">{c('Header').t`Countries`}</span>
                        <Info title={c('Tooltip').t`Access to VPN servers`} />
                    </th>
                    <td className="aligncenter">{serversLoading ? <Loader /> : freeCountriesCount}</td>
                    <td className="aligncenter">{serversLoading ? <Loader /> : basicCountriesCount}</td>
                    <td className="aligncenter">{serversLoading ? <Loader /> : allCountriesCount}</td>
                    <td className="aligncenter">{serversLoading ? <Loader /> : allCountriesCount}</td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        <span className="mr0-5">{c('Header').t`Devices`}</span>
                        <Info title={c('Tooltip').t`Number of simultaneous connections`} />
                    </th>
                    <td className="aligncenter">1</td>
                    <td className="aligncenter">2</td>
                    <td className="aligncenter">5</td>
                    <td className="aligncenter">10</td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">{c('Header')
                        .t`Speed`}</th>
                    <td className="aligncenter">{c('Plan details').t`Medium`}</td>
                    <td className="aligncenter">{c('Plan details').t`High`}</td>
                    <td className="aligncenter">{c('Plan details').t`Highest`}</td>
                    <td className="aligncenter">{c('Plan details').t`Highest`}</td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        <span className="mr0-5">{c('Header').t`Plus servers`}</span>
                        <Info
                            title={c('Tooltip')
                                .t`Exclusive servers only available to Plus and Visionary users with higher speed`}
                        />
                    </th>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        <span className="mr0-5">{c('Header').t`Secure core`}</span>
                        <Info
                            title={c('Tooltip')
                                .t`Provides additional protection against VPN server compromise by routing connections through our Secure Core network`}
                        />
                    </th>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        <span className="mr0-5">{c('Header').t`Tor servers`}</span>
                        <Info
                            title={c('Tooltip').t`Send all your traffic through the Tor network with a single click`}
                        />
                    </th>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                </tr>
                <tr>
                    <th scope="row" className="pm-simple-table-row-th alignleft bg-global-light">
                        <span className="mr0-5">ProtonMail Visionary</span>
                        <Info title={c('Tooltip').t`Includes ProtonMail encrypted email with all features`} />
                    </th>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="off" />
                    </td>
                    <td className="aligncenter">
                        <Icon name="on" />
                    </td>
                </tr>
                {onSelect && (
                    <tr>
                        <th scope="row" className="pm-simple-table-row-th alignleft" />
                        <td className="aligncenter">
                            <SmallButton disabled={loading} className="pm-button--primary" onClick={onSelect()}>{c(
                                'Action'
                            ).t`Update`}</SmallButton>
                        </td>
                        <td className="aligncenter">
                            <SmallButton
                                disabled={loading}
                                className="pm-button--primary"
                                onClick={onSelect(VPNBASIC)}
                            >{c('Action').t`Update`}</SmallButton>
                        </td>
                        <td className="aligncenter">
                            <SmallButton
                                disabled={loading}
                                className="pm-button--primary"
                                onClick={onSelect(VPNPLUS)}
                            >{c('Action').t`Update`}</SmallButton>
                        </td>
                        <td className="aligncenter">
                            <SmallButton
                                disabled={loading}
                                className="pm-button--primary"
                                onClick={onSelect(VISIONARY)}
                            >{c('Action').t`Update`}</SmallButton>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

PlansTable.propTypes = {
    loading: PropTypes.bool,
    plans: PropTypes.array,
    onSelect: PropTypes.func,
    currency: PropTypes.string,
    cycle: PropTypes.number,
    updateCurrency: PropTypes.func,
    updateCycle: PropTypes.func,
    subscription: PropTypes.object,
    extendedDetails: PropTypes.bool
};

export default PlansTable;
