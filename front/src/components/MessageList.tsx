import * as React from 'react';
import { Alert } from 'react-bootstrap';

import './MessageList.css';

export interface MessageListProps {
    messages: string[];
}

class MessageList extends React.Component<MessageListProps, object> {
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
                            className="MessagesList"
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

export default MessageList;
