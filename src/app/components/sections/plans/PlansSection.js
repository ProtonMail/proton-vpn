import React, { useState, useEffect } from 'react';
import {
    Alert,
    SubTitle,
    useApi,
    usePlans,
    Loader,
    useSubscription,
    DowngradeModal,
    useModals,
    SubscriptionModal,
    useLoading,
    useEventManager,
    useNotifications,
    useUser,
    ConfirmModal
} from 'react-components';
import { c } from 'ttag';
import { DEFAULT_CURRENCY, DEFAULT_CYCLE } from 'proton-shared/lib/constants';
import { checkSubscription, deleteSubscription } from 'proton-shared/lib/api/payments';
import { isBundleEligible, getPlans, getPlan } from 'proton-shared/lib/helpers/subscription';
import { mergePlansMap } from 'react-components/containers/payments/subscription/helpers';
import { PLANS } from 'proton-shared/lib/constants';

import PlansTable from './PlansTable';

const PlansSection = () => {
    const api = useApi();
    const [{ isFree, isPaid }] = useUser();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [loading, withLoading] = useLoading();
    const [currency, updateCurrency] = useState(DEFAULT_CURRENCY);
    const [cycle, updateCycle] = useState(DEFAULT_CYCLE);
    const [plans, loadingPlans] = usePlans();
    const [subscription, loadingSubscription] = useSubscription();
    const bundleEligible = isBundleEligible(subscription);
    const names = getPlans(subscription)
        .map(({ Title }) => Title)
        .join(c('Separator, spacing is important').t` and `);
    const { CouponCode, Plans = [] } = subscription || {};

    const unsubscribe = async () => {
        if (isFree) {
            return createNotification({ type: 'error', text: c('Info').t`You already have a free account` });
        }

        const { Name = '' } = getPlan(subscription);

        if (Name && Name !== PLANS.VISIONARY) {
            await new Promise((resolve, reject) => {
                createModal(
                    <ConfirmModal title={c('Title').t`Confirm downgrade`} onConfirm={resolve} onClose={reject}>
                        <Alert type="warning">{c('Info')
                            .t`This will downgrade your VPN to a free subscription. ProtonVPN is free software that is possible thanks to donations and paid accounts. Please consider making a donation so we can continue to enable secure internet anywhere for everyone.`}</Alert>
                    </ConfirmModal>
                );
            });
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return handleSelectPlan(Name);
        }

        await new Promise((resolve, reject) => {
            createModal(<DowngradeModal onConfirm={resolve} onClose={reject} />);
        });
        await api(deleteSubscription());
        await call();
        createNotification({ text: c('Success').t`You have successfully unsubscribed` });
    };

    const handleSelectPlan = async (planName) => {
        if (!planName) {
            return unsubscribe();
        }

        const plansMap = mergePlansMap({ [planName]: 1 }, subscription);
        const couponCode = CouponCode ? CouponCode : undefined; // From current subscription; CouponCode can be null
        const PlanIDs = Object.entries(plansMap).reduce((acc, [planName, quantity]) => {
            if (quantity) {
                const { ID } = plans.find((plan) => plan.Name === planName);
                acc[ID] = quantity;
            }
            return acc;
        }, Object.create(null));

        const { Coupon } = await api(
            checkSubscription({
                PlanIDs,
                CouponCode: couponCode,
                Currency: currency,
                Cycle: cycle
            })
        );

        const coupon = Coupon ? Coupon.Code : undefined; // Coupon can equals null

        createModal(
            <SubscriptionModal
                subscription={subscription}
                cycle={cycle}
                currency={currency}
                coupon={coupon}
                plansMap={plansMap}
            />
        );
    };

    useEffect(() => {
        if (isFree) {
            const [{ Currency } = {}] = plans || [];
            updateCurrency(Currency);
        }
    }, [plans]);

    useEffect(() => {
        if (isPaid) {
            const { Currency, Cycle } = subscription || {};
            updateCurrency(Currency);
            updateCycle(Cycle);
        }
    }, [subscription]);

    if (loadingPlans || loadingSubscription) {
        return (
            <>
                <SubTitle>{c('Title').t`Plans`}</SubTitle>
                <Loader />
            </>
        );
    }

    return (
        <>
            <SubTitle>{c('Title').t`Plans`}</SubTitle>
            <Alert>
                {bundleEligible ? (
                    <div>{c('Info')
                        .t`Get 20% bundle discount when you purchase ProtonMail and ProtonVPN together.`}</div>
                ) : null}
                {Plans.length ? <div>{c('Info').t`You are currently subscribed to ${names}.`}</div> : null}
            </Alert>
            <div className="scroll-horizontal-if-needed pt3">
                <PlansTable
                    onSelect={(planName) => () => withLoading(handleSelectPlan(planName))}
                    loading={loading}
                    currency={currency}
                    cycle={cycle}
                    updateCurrency={updateCurrency}
                    updateCycle={updateCycle}
                    plans={plans}
                    subscription={subscription}
                />
            </div>
        </>
    );
};

export default PlansSection;
