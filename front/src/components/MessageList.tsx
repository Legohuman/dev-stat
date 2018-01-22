import * as React from 'react';

import './MessageList.css';
import { connect } from 'react-redux';
import { DashboardState } from '../types/DashboardState';
import * as _ from 'lodash';
import { Alert } from 'react-bootstrap';

export interface MessageListProps {
    messages: string[];
}

export class MessageList extends React.Component<MessageListProps, object> {
    render() {
        const p = this.props;

        if (p.messages.length > 0) {
            return (
                <Alert
                    className="MessagesList"
                    bsStyle="warning"
                >
                    {p.messages.map((message, i) =>
                        <div
                            key={'m' + i}
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

function mapStateToProps(state: DashboardState) {
    return {messages: _.compact(_.flatten(_.compact(_.values(state.messages))))};
}

export const MessageListContainer = connect(mapStateToProps)(MessageList);