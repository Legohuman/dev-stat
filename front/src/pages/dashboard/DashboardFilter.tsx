import * as React from 'react';
import './DashboardFilter.css';
import { Form, FormControl, FormGroup } from 'react-bootstrap';
import { DashboardFilterData } from '../../types/DashboardState';

class DashboardFilter extends React.Component<DashboardFilterData, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardFilter">
                <Form inline={true}>
                    <FormGroup controlId="formInlineName">
                        <FormControl
                            type="text"
                            placeholder="Start date"
                            defaultValue={p.startDate.toString()}
                        />
                    </FormGroup>
                    {' \u2014 '}
                    <FormGroup controlId="formInlineEmail">
                        <FormControl
                            type="text"
                            placeholder="End date"
                            defaultValue={p.endDate.toString()}
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default DashboardFilter;
