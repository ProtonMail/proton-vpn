import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Field, Input, PrimaryButton } from 'react-components';
import { c } from 'ttag';

const VerificationInput = ({ isLoading, onVerify }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(code);
    };
    const handleChangeCode = ({ target }) => setCode(target.value);

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Field className="mr1">
                    <Input
                        value={code}
                        onChange={handleChangeCode}
                        placeholder={c('Placeholder').t`Verification code`}
                    />
                </Field>
                <div>
                    <PrimaryButton disabled={!code} type="submit" loading={isLoading}>{c('Action')
                        .t`Validate`}</PrimaryButton>
                </div>
            </Row>
        </form>
    );
};

VerificationInput.propTypes = {
    isLoading: PropTypes.bool,
    onVerify: PropTypes.func.isRequired
};

export default VerificationInput;