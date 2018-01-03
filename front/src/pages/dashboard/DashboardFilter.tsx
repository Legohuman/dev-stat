import * as React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import * as moment from 'moment';

import DatePicker from '../../components/DatePicker';
import { DashboardFilterData } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';
import './DashboardFilter.css';

class DashboardFilter extends React.Component<DashboardFilterData & DashboardPageHandlers, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardFilter">
                <Form inline={true}>
                    Date period:
                    <FormGroup>
                        <DatePicker
                            selected={p.startDate}
                            selectsStart={true}
                            startDate={p.startDate}
                            endDate={p.endDate}
                            onChange={(date: moment.Moment | null) => {
                                p.handlers.handlePeriodChange(date || undefined, p.endDate);
                            }}
                        />
                    </FormGroup>
                    {' \u2014 '}
                    <FormGroup>
                        <DatePicker
                            selected={p.endDate}
                            selectsEnd={true}
                            startDate={p.startDate}
                            endDate={p.endDate}
                            onChange={(date: moment.Moment | null) => {
                                p.handlers.handlePeriodChange(p.startDate, date || undefined);
                            }}
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default DashboardFilter;
