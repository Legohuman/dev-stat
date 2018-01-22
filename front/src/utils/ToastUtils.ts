import { toast } from 'react-toastify';
import * as _ from 'lodash';

const autoCloseDelay = 5000;
let shownMessages = {};

function onToastClose(message: string) {
    shownMessages = _.omit(shownMessages, message);
}

export const toasts = {
    error(message: string) {
        const shownToastId = shownMessages[message];

        if (shownToastId) {
            toast.update(shownToastId, {autoClose: autoCloseDelay});
        } else {
            shownMessages[message] = toast.error(message, {
                autoClose: autoCloseDelay,
                onClose: () => onToastClose(message)
            });
        }
    }
};