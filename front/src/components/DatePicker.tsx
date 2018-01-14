import * as React from 'react';
import ReactDatePickerDefault, * as ReactDatePicker from 'react-datepicker';
import { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

const DatePickerComponent = ReactDatePickerDefault || ReactDatePicker; //workaround for Jest tests

export const defaultDateFormat = 'DD.MM.YYYY';
const commonDatePickerProps = {
    peekNextMonth: true,
    showMonthDropdown: true,
    showYearDropdown: true,
    dateFormat: defaultDateFormat,
    isClearable: true
};

class DatePicker extends React.Component<ReactDatePickerProps, object> {
    render() {
        return (
            <DatePickerComponent
                {...commonDatePickerProps}
                {...this.props}
            />
        );
    }
}

export default DatePicker;