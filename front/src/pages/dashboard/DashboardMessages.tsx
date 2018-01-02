import * as React from 'react';
import * as _ from 'lodash';
import { Alert } from 'react-bootstrap';

import './DashboardMessages.css';
import { DashboardErrorMessages } from '../../types/DashboardState';

class DashboardMessages extends React.Component<DashboardErrorMessages, object> {
    render() {
        const p = this.props,
            messages = _.values(p).filter(_.identity);

        if (messages.length > 0) {
            return (
                <Alert
                    className="DashboardMessages"
                    bsStyle="warning"
                >
                    {messages.map((message, i) => <div
                            key={'m' + i}
                            className="DashboardMessages-Message"
                        >
                            {message}
                        </div>
                    )}
                </Alert>
            );
        }
        return null;
    }
}

export default DashboardMessages;
