import * as React from 'react';
import {
    usePermissions,
    Paragraph,
    SettingsPropsShared,
    PrivateMainSettingsArea,
    SectionConfig
} from 'react-components';
import { c } from 'ttag';
import { Link } from 'react-router-dom';
import { hasPermission } from 'proton-shared/lib/helpers/permissions';
import { getLightOrDark } from 'proton-shared/lib/themes/helpers';
import upgradeSvgLight from 'design-system/assets/img/shared/no-organization.svg';
import upgradeSvgDark from 'design-system/assets/img/shared/no-organization-dark.svg';

interface Props extends SettingsPropsShared {
    config: SectionConfig;
    children?: React.ReactNode;
}

const PrivateMainSettingsAreaWithPermissions = ({ config, location, children, setActiveSection }: Props) => {
    const userPermissions = usePermissions();
    const { subsections = [], permissions: pagePermissions = [], text } = config;

    const noPermissionChild = (() => {
        if (!hasPermission(userPermissions, pagePermissions)) {
            const upgradeSvg = getLightOrDark(upgradeSvgLight, upgradeSvgDark);
            return (
                <div id="page-error" className="aligncenter">
                    <img src={upgradeSvg} alt={c('Title').t`Upgrade`} className="mb2" />
                    <Paragraph>
                        {c('Info')
                            .t`Upgrade to a paid plan to access premium features and increase your storage space.`}
                    </Paragraph>
                    <Link to="/dashboard">{c('Link').t`Upgrade now`}</Link>
                </div>
            );
        }
    })();

    const childrenWithPermission = React.Children.toArray(children)
        .filter(React.isValidElement)
        .map((child, index) => {
            const { permissions: sectionPermissions } = subsections[index];
            return React.cloneElement(child, {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                permission: hasPermission(userPermissions, sectionPermissions)
            });
        });

    return (
        <PrivateMainSettingsArea
            title={text}
            location={location}
            setActiveSection={setActiveSection}
            subsections={noPermissionChild ? [] : subsections}
        >
            {noPermissionChild || childrenWithPermission}
        </PrivateMainSettingsArea>
    );
};

export default PrivateMainSettingsAreaWithPermissions;
