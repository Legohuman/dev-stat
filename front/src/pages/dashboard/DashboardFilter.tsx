import * as React from 'react';
import './DashboardFilter.css';
import { FormGroup, FormControl, Form } from 'react-bootstrap';

export interface Props {
    startDate: Date;
    endDate: Date;
}

class DashboardFilter extends React.Component<Props, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardFilter">
                <Form inline={true}>
                    <FormGroup controlId="formInlineName">
                        <FormControl
                            type="text"
                            placeholder="Start date"
                            value={p.startDate.toString()}
                        />
                    </FormGroup>
                    {' \u2014 '}
                    <FormGroup controlId="formInlineEmail">
                        <FormControl
                            type="text"
                            placeholder="End date"
                            value={p.endDate.toString()}
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default DashboardFilter;
