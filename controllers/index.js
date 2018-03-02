import users from './users';
import messages from './messages';

module.exports = app => {
    users(app);
    messages(app);
    // Тут, позже, будут и другие обработчики маршрутов
};