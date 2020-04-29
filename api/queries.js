const getPasswordQuery = (username) => `select password from users where username='${username}';`
const getLoginQuery = (username, password) => {
    return `SELECT id, is_admin, username, first_name FROM users WHERE username='${username}' AND password='${password}'`
}
const getAttendanceQuery = (id, ip, gps) => {
    return `insert into attendance (user_id, created_at, gps, ip) values ('${id}', now(), '${gps}', '${ip}')`
}
const getAdminQuery = (username, password) => {
    return `SELECT is_admin FROM users WHERE username='${username}' AND password='${password}'`
}
const getSelfieUpdateQuery = (user, selfiePath) => `update attendance set selfie_url='${selfiePath}' where user_id='${user.id}' order by created_at desc limit 1`

module.exports = {
    getPasswordQuery,
    getLoginQuery,
    getAttendanceQuery,
    getAdminQuery,
    getSelfieUpdateQuery
}