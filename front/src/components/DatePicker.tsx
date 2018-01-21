import * as React from 'react';
import * as moment from 'moment';
import ReactDatePickerDefault, * as ReactDatePicker from 'react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import { defaultDateFormat } from '../utils/AppConstants';

const DatePickerComponent = ReactDatePickerDefault || ReactDatePicker; //workaround for Jest tests

const commonDatePickerProps = {
    peekNextMonth: true,
    showMonthDropdown: true,
    showYearDropdown: true,
    dateFormat: defaultDateFormat,
    isClearable: true,
    disabledKeyboardNavigation: true
};

class DatePicker extends React.Component<ReactDatePickerProps, object> {
    private lastValue: string | null;
    private originalOnChange: (date: moment.Moment | null, event: React.SyntheticEvent<any> | undefined) => any;

    constructor(props: ReactDatePickerProps) {
        super(props);
    }

    render() {
        this.originalOnChange = this.props.onChange;
        return (
            <DatePickerComponent
                {...commonDatePickerProps}
                {...this.props}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
            />
        );
    }

    private handleChange = (date: moment.Moment | null, event: React.SyntheticEvent<any> | undefined) => {
        this.lastValue = date && date.format(defaultDateFormat);
        this.originalOnChange(date, event);
    }

    private handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const datePickerInput = event.nativeEvent.target as HTMLInputElement;
        const inputValue = datePickerInput.value || null; //empty string -> null
        if (this.lastValue !== inputValue) {
            const date = inputValue && moment(inputValue, defaultDateFormat, true) || null;
            this.lastValue = inputValue;
            this.originalOnChange(date, undefined);
        }
    }
}

export default DatePicker;