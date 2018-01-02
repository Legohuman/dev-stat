import * as React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DashboardFilter.css';

import { DashboardFilterData } from '../../types/DashboardState';
import { DashboardPageHandlers } from './DashboardPageHandlers';

const filterDateFormat = 'DD.MM.YYYY';
const commonDatePickerProps = {
    peekNextMonth: true,
    showMonthDropdown: true,
    showYearDropdown: true,
    dateFormat: filterDateFormat
};

class DashboardFilter extends React.Component<DashboardFilterData & DashboardPageHandlers, object> {
    render() {
        const p = this.props;

        return (
            <div className="DashboardFilter">
                <Form inline={true}>
                    Date period:
                    <FormGroup controlId="formInlineName">
                        <DatePicker
                            selected={p.startDate}
                            selectsStart={true}
                            startDate={p.startDate}
                            endDate={p.endDate}
                            onChange={(date: moment.Moment | null) => {
                                p.handlers.handlePeriodChange(date || undefined, p.endDate);
                            }}
                            {...commonDatePickerProps}
                        />
                    </FormGroup>
                    {' \u2014 '}
                    <FormGroup controlId="formInlineEmail">
                        <DatePicker
                            selected={p.endDate}
                            selectsEnd={true}
                            startDate={p.startDate}
                            endDate={p.endDate}
                            onChange={(date: moment.Moment | null) => {
                                p.handlers.handlePeriodChange(p.startDate, date || undefined);
                            }}
                            {...commonDatePickerProps}
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default DashboardFilter;
