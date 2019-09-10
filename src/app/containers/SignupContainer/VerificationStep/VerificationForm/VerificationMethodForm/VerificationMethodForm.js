import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, useLoading, Radio, Label, Field } from 'react-components';
import { c } from 'ttag';
import VerificationEmailInput from './VerificationEmailInput';
import VerificationPhoneInput from './VerificationPhoneInput';
import { TOKEN_TYPES } from 'proton-shared/lib/constants';

const VERIFICATION_METHOD = {
    EMAIL: TOKEN_TYPES.EMAIL,
    SMS: TOKEN_TYPES.SMS
};

const VerificationMethodForm = ({ defaultEmail, allowedMethods, onSubmit }) => {
    const isMethodAllowed = (method) => allowedMethods.includes(method);
    const defaultMethod = Object.values(VERIFICATION_METHOD).find(isMethodAllowed);

    const [loading, withLoading] = useLoading();
    const [method, setMethod] = useState(defaultMethod);

    const handleSendEmailCode = (Address) =>
        withLoading(onSubmit({ Type: VERIFICATION_METHOD.EMAIL, Destination: { Address } }));
    const handleSendSMSCode = (Phone) =>
        withLoading(onSubmit({ Type: VERIFICATION_METHOD.SMS, Destination: { Phone } }));

    const handleSelectMethod = (method) => () => setMethod(method);

    return (
        <div>
            <h3>{c('Title').t`Select an account verification method`}</h3>

            {allowedMethods.length ? (
                <Row>
                    <Label>{c('Label').t`Verification method`}</Label>
                    <Field className="auto flex-item-fluid-auto">
                        <div className="pt0-5 mb1">
                            {isMethodAllowed(VERIFICATION_METHOD.EMAIL) ? (
                                <Radio
                                    className="mr1"
                                    checked={method === VERIFICATION_METHOD.EMAIL}
                                    onChange={handleSelectMethod(VERIFICATION_METHOD.EMAIL)}
                                >{c('Option').t`Email address`}</Radio>
                            ) : null}
                            {isMethodAllowed(VERIFICATION_METHOD.SMS) && (
                                <Radio
                                    checked={method === VERIFICATION_METHOD.SMS}
                                    onChange={handleSelectMethod(VERIFICATION_METHOD.SMS)}
                                >{c('Option').t`SMS`}</Radio>
                            )}
                        </div>
                        <div>
                            {method === VERIFICATION_METHOD.EMAIL && (
                                <VerificationEmailInput
                                    loading={loading}
                                    defaultEmail={defaultEmail}
                                    onSendClick={handleSendEmailCode}
                                />
                            )}
                            {method === VERIFICATION_METHOD.SMS && (
                                <VerificationPhoneInput loading={loading} onSendClick={handleSendSMSCode} />
                            )}
                        </div>
                    </Field>
                </Row>
            ) : null}
        </div>
    );
};

VerificationMethodForm.propTypes = {
    defaultEmail: PropTypes.string.isRequired,
    allowedMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default VerificationMethodForm;
