import { message } from "antd";
import dayjs from "dayjs";

window.getRandomId = () => Math.random().toString(36).slice(2)

// window.timestampToDate = (date, format = "DD-MM-YYYY") => {
//     return date ? dayjs(date.seconds * 1000).format(format) : "";
// }
// window.dateFormat = (date, format = "DD-MM-YYYY") => date ? dayjs(date).format(format) : "";

window.today = dayjs(new Date()).format("DD-MM-YYYY")
window.month = dayjs(new Date()).format("MM-YYYY")
window.year = new Date().getFullYear()


window.toastify = (msg, type) => {

    switch (type) {
        case "success":
            message.success(msg)
            break;
        case "error":
            message.error(msg)
            break;
        case "warning":
            message.warning(msg)
            break;
        default:
            message.info(msg)
    }
}
