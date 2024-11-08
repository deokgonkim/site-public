const moment = require('moment-timezone');

export const toHumanReadable = (date, timezone = 'Asia/Seoul') => {
  const d = moment(date).tz(timezone);
  return d.format('YYYY-MM-DD HH:mm');
};
