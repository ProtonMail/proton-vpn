import React from 'react';
import PropTypes from 'prop-types';
import { Row, Field, CurrencySelector, CycleSelector } from 'react-components';
import PlanCard from './PlanCard/PlanCard';
import { CURRENCIES, CYCLE } from 'proton-shared/lib/constants';
import { getPlan, PLAN, VPN_PLANS } from '../plans';

const PlanStep = ({ plans, onSelectPlan, onChangeCurrency, onChangeCycle, model, signupAvailability }) => {
    const handleSelect = (planName) => () => onSelectPlan({ ...model, planName });

    return (
        <>
            <Row className="flex-spacebetween">
                <Field>
                    <CycleSelector cycle={model.cycle} onSelect={onChangeCycle} />
                </Field>
                <Field>
                    <CurrencySelector currency={model.currency} onSelect={onChangeCurrency} />
                </Field>
            </Row>
            <div className="flex-autogrid">
                {VPN_PLANS.map((planName) => {
                    const plan = getPlan(planName, model.cycle, plans);
                    return (
                        <PlanCard
                            key={planName}
                            onSelect={handleSelect(planName)}
                            cycle={model.cycle}
                            currency={model.currency}
                            plan={plan}
                            isActive={planName === model.planName}
                            isDisabled={plan.disabled || (!signupAvailability.paid && plan.price.monthly > 0)}
                        />
                    );
                })}
            </div>
        </>
    );
};

PlanStep.propTypes = {
    signupAvailability: PropTypes.shape({
        paid: PropTypes.bool
    }).isRequired,
    plans: PropTypes.arrayOf(PropTypes.object).isRequired, // TODO: better type
    model: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
        currency: PropTypes.oneOf(CURRENCIES).isRequired
    }).isRequired,
    onSelectPlan: PropTypes.func.isRequired,
    onChangeCycle: PropTypes.func.isRequired,
    onChangeCurrency: PropTypes.func.isRequired
};

export default PlanStep;
