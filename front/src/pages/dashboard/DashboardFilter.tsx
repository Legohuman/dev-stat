import * as React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import * as moment from 'moment';

import DatePicker from '../../components/DatePicker';
import { DashboardFilterData, DashboardState } from '../../types/DashboardState';
import './DashboardFilter.css';
import { connect, Dispatch } from 'react-redux';
import { ActionsFactory } from '../../actions/ActionsFactory';

interface DashboardFilterHandlers {
    handlers: {
        handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): void
    };
}

export class DashboardFilter extends React.Component<DashboardFilterData & DashboardFilterHandlers, object> {
    componentDidMount(): void {
        const p = this.props;

        p.handlers.handlePeriodChange(p.startDate, p.endDate);
    }

    render() {
        const p = this.props;

        return (
            <div className="DashboardFilter">
                <Form inline={true}>
                    Date period:
                    <FormGroup className="DashboardFilter-DatePickerContainer">
                        <DatePicker
                            selected={this.todayIfInvalid(p.startDate)}
                            selectsStart={true}
                            startDate={this.todayIfInvalid(p.startDate)}
                            endDate={this.todayIfInvalid(p.endDate)}
                            onChange={this.handleStartDateChange}
                        />
                    </FormGroup>
                    {' \u2014 '}
                    <FormGroup className="DashboardFilter-DatePickerContainer">
                        <DatePicker
                            selected={this.todayIfInvalid(p.endDate)}
                            selectsEnd={true}
                            startDate={this.todayIfInvalid(p.startDate)}
                            endDate={this.todayIfInvalid(p.endDate)}
                            onChange={this.handleEndDateChange}
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }

    private todayIfInvalid(date?: moment.Moment): moment.Moment | undefined {
        return date && !date.isValid() ? moment() : date;
    }

    private handleStartDateChange = (date: moment.Moment | null) => {
        const p = this.props;
        p.handlers.handlePeriodChange(date || undefined, p.endDate);
    }

    private handleEndDateChange = (date: moment.Moment | null) => {
        const p = this.props;
        p.handlers.handlePeriodChange(p.startDate, date || undefined);
    }
}

function mapStateToProps(state: DashboardState) {
    return state.filter;
}

function createDashboardFilterHandlers(dispatch: Dispatch<DashboardState &
    DashboardFilterHandlers>): DashboardFilterHandlers {
    return {
        handlers: {
            handlePeriodChange(startDate?: moment.Moment, endDate?: moment.Moment): void {
                dispatch(ActionsFactory.handlePeriodChange(startDate, endDate));
            }
        }
    };
}

export const DashboardFilterContainer = connect(mapStateToProps, createDashboardFilterHandlers)(DashboardFilter);
